import { ArnFormat, CfnMapping, Fn, IResource, Resource, ResourceProps, Stack, Token } from "aws-cdk-lib";
import { Metric, MetricOptions } from "aws-cdk-lib/aws-cloudwatch";
import { Connections, IConnectable, Peer } from "aws-cdk-lib/aws-ec2";
import { Grant, IGrantable, IPrincipal, IRole, UnknownPrincipal } from "aws-cdk-lib/aws-iam";
import { CfnDeliveryStream } from "aws-cdk-lib/aws-kinesisfirehose";
import { RegionInfo } from "aws-cdk-lib/region-info";
import { Construct } from "constructs";
import { DeliveryStreamDestination } from "./lib/destinations/delivery-stream-destination";


export enum DeliveryStreamType {
    DIRECT_PUT = 'DirectPut',
    KINESIS_STREAM_AS_SOURCE = 'KinesisStreamAsSource'
}

export interface IDeliveryStream extends IResource, IGrantable, IConnectable {
    readonly deliveryStreamArn: string;
    readonly deliveryStreamName: string;
    grant(grantee: IGrantable, ...actions: string[]): Grant;
    grantPutRecords(grantee: IGrantable): Grant;
    metric(metricName: string, props?: MetricOptions): Metric;
    metricBackupToS3Bytes(props?: MetricOptions): Metric;
    metricBackupToS3DataFreshness(props?: MetricOptions): Metric;
    metricBackupToS3Records(props?: MetricOptions): Metric;
    metricIncomingBytes(props?: MetricOptions): Metric;
    metricIncomingRecords(props?: MetricOptions): Metric;
  }

abstract class DeliveryStreamBase extends Resource implements IDeliveryStream {
    public abstract readonly deliveryStreamName: string;
    public abstract readonly deliveryStreamArn: string;
    public abstract readonly grantPrincipal: IPrincipal;

    public readonly connections: Connections;

    public constructor(scope: Construct, id: string, props: ResourceProps = {}) {
        super(scope, id, props);

        const mappingId = '@aws-cdk/aws-kinesisfirehose.CidrBlocks';
        const mapping = this.node.tryFindChild(mappingId) as CfnMapping ?? new CfnMapping(this, mappingId, {
            lazy: true,
            mapping: RegionInfo.regions.reduce((prev, cur) => {
                if (cur.firehoseCidrBlock) {
                    prev[cur.name] = {
                        FirehoseCidrBlock: cur.firehoseCidrBlock
                    };
                }
                return prev;
            }, {} as {[key: string]: {FirehoseCidrBlock: string}})
        });

        this.connections = new Connections({
            peer: Peer.ipv4(mapping.findInMap(this.stack.region, 'FirehoseCidrBlock'))
        });
    }

    public grant(grantee: IGrantable, ...actions: string[]): Grant {
        return Grant.addToPrincipal({
            resourceArns: [
                this.deliveryStreamArn
            ],
            grantee: grantee,
            actions: actions
        });
    }

    public grantPutRecords(grantee: IGrantable): Grant {
        return this.grant(grantee, ...[
            'firehose:PutRecord',
            'firehose:PutRecordBatch'
        ]);
    }

    public metric(metricName: string, props?: MetricOptions): Metric {
        return new Metric({
            dimensionsMap: {
                DeliveryStreamName: this.deliveryStreamName
            },
            metricName: metricName,
            namespace: 'AWS/Firehose',
            ...props
        }).attachTo(this);
    }

    public metricBackupToS3Bytes(props?: MetricOptions): Metric {
        return this.metric('BackupToS3.Bytes', {
            statistic: 'Sum',
            ...props
        });
    }

    public metricBackupToS3DataFreshness(props?: MetricOptions): Metric {
        return this.metric('BackupToS3.DataFreshness', {
            statistic: 'Average',
            ...props
        });
    }
    
    public metricBackupToS3Records(props?: MetricOptions): Metric {
        return this.metric('BackupToS3.Records', {
            statistic: 'Sum',
            ...props
        });
    }

    public metricIncomingBytes(props?: MetricOptions): Metric {
        return this.metric('IncomingBytes', {
            statistic: 'Sum',
            ...props
        });
    }

    public metricIncomingRecords(props?: MetricOptions): Metric {
        return this.metric('IncomingRecords', {
            statistic: 'Sum',
            ...props
        });
    }
}

export interface DeliveryStreamAttributes {
    readonly deliveryStreamArn?: string;
    readonly deliveryStreamName?: string;
    readonly role?: IRole;
}

export interface DeliveryStreamProps extends ResourceProps {
    readonly destination: DeliveryStreamDestination;
    readonly name?: string;
    readonly streamType?: DeliveryStreamType;
}

export class DeliveryStream extends DeliveryStreamBase {
    public static fromDeliveryStreamArn(scope: Construct, id: string, deliveryStreamArn: string): IDeliveryStream {
        return DeliveryStream.fromDeliveryStreamAttributes(scope, id, {
            deliveryStreamArn: deliveryStreamArn
        });
    }

    public static fromDeliveryStreamAttributes(scope: Construct, id: string, attrs: DeliveryStreamAttributes): IDeliveryStream {
        if (!attrs.deliveryStreamArn && !attrs.deliveryStreamName) {
            throw new Error('Must specify at least one of deliveryStreamArn or deliveryStreamName when importing a delivery stream.');
        }

        const deliveryStreamArn = attrs.deliveryStreamArn ?? Stack.of(scope).formatArn({
            resource: 'deliverystream',
            resourceName: attrs.deliveryStreamName,
            service: 'firehose'
        });

        const intrinsitName = Fn.select(1, Fn.split('/', deliveryStreamArn));
        const parsedName = !Token.isUnresolved(deliveryStreamArn) ? 
            Stack.of(scope).splitArn(deliveryStreamArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName :
            intrinsitName;
        const deliveryStreamName = attrs.deliveryStreamName ?? parsedName ?? intrinsitName;

        class Import extends DeliveryStreamBase {
            public readonly deliveryStreamArn: string = deliveryStreamArn;
            public readonly deliveryStreamName: string = deliveryStreamName;
            public readonly grantPrincipal: IPrincipal = attrs.role ?? new UnknownPrincipal({
                resource: this
            });
        }

        return new Import(scope, id);
    }

    public static fromDeliveryStreamName(scope: Construct, id: string, deliveryStreamName: string): IDeliveryStream {
        return DeliveryStream.fromDeliveryStreamAttributes(scope, id, {
            deliveryStreamName: deliveryStreamName
        });
    }

    // Input properties
    public readonly destination: DeliveryStreamDestination;
    public readonly name?: string;
    public readonly streamType?: DeliveryStreamType;

    // Resource properties
    public readonly resource: CfnDeliveryStream;

    // Standard properties
    public readonly deliveryStreamArn: string;
    public readonly deliveryStreamName: string;
    public readonly grantPrincipal: IPrincipal;


    constructor(scope: Construct, id: string, props: DeliveryStreamProps) {
        super(scope, id, props);

        this.destination = props.destination;
        this.name = props.name;
        this.streamType = props.streamType;

        const resolvedDestination = this.destination.bind(this);

        this.resource = new CfnDeliveryStream(this, 'Resource', {
            ...resolvedDestination,
            deliveryStreamName: this.name,
            deliveryStreamType: this.streamType
        });

        this.deliveryStreamArn = this.resource.attrArn;
        this.deliveryStreamName = this.resource.ref;

        this.grantPrincipal = this.destination.role ?? new UnknownPrincipal({
            resource: this
        });
    }
}

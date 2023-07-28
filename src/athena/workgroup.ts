import { ArnFormat, Names, Resource, ResourceProps, Token } from 'aws-cdk-lib';
import { CfnWorkGroup } from 'aws-cdk-lib/aws-athena';
import { IConstruct } from 'constructs';
import { NamedQuery } from '.';
import { AnalyticsEngine, IAnalyticsEngine } from './lib/analytics-engine';
import { Database } from '../glue';
import { ResourceImporter } from '../utils/importer';


/**
 * Configuration for adding a NamedQuery to a WorkGroup.
 */
export interface AddNamedQueryOptions extends ResourceProps {
  /**
   * The Glue database to which the query belongs.
   *
   * @see [NamedQuery Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-database)
   */
  readonly database: Database;

  /**
   * A human friendly description explaining the functionality of the query.
   *
   * @see [NamedQuery Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-description)
   */
  readonly description?: string;

  /**
   * The name of the query.
   *
   * @see [NamedQuery Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-name)
   */
  readonly name?: string;

  /**
   * The SQL statements that make up the query.
   *
   * @see [NamedQuery QueryString](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-querystring)
   * @see [Athena SQL reference](https://docs.aws.amazon.com/athena/latest/ug/ddl-sql-reference.html)
   */
  readonly queryString: string;
}

export class WorkGroupState {
  public static readonly DISABLED: WorkGroupState = WorkGroupState.of('DISABLED');
  public static readonly ENABLED: WorkGroupState = WorkGroupState.of('ENABLED');

  public static of(name: string): WorkGroupState {
    return new WorkGroupState(name);
  }


  private constructor(public readonly name: string) {}
}

export interface IWorkGroup {
  readonly workGroupArn: string;
  readonly workGroupCreationTime: string;
  readonly workGroupEffectiveEngineVersion: string;
  readonly workGroupName: string;
}

abstract class WorkGroupBase extends Resource implements IWorkGroup {
  public abstract readonly workGroupArn: string;
  public abstract readonly workGroupCreationTime: string;
  public abstract readonly workGroupEffectiveEngineVersion: string;
  public abstract readonly workGroupName: string;

  public addNamedQuery(id: string, options: AddNamedQueryOptions): NamedQuery {
    return new NamedQuery(this, `named-query-${id}`, {
      ...options,
      workGroup: this,
    });
  }
}

export interface WorkGroupAttributes {
  readonly arn?: string;
  readonly creationTime?: string;
  readonly effectiveEngineVersion?: string;
  readonly name?: string;
}

export interface WorkGroupOptions {
  readonly description?: string;
  readonly engine?: IAnalyticsEngine;
  readonly name?: string;
  readonly recursiveDelete?: boolean;
  readonly state?: WorkGroupState;
}

export interface WorkGroupProps extends ResourceProps, WorkGroupOptions {}

export class WorkGroup extends WorkGroupBase {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;

  public static fromWorkGroupArn(scope: IConstruct, id: string, arn: string): IWorkGroup {
    return WorkGroup.fromWorkGroupAttributes(scope, id, {
      arn: arn,
    });
  }

  public static fromWorkGroupAttributes(scope: IConstruct, id: string, attrs: WorkGroupAttributes): IWorkGroup {
    const importer = new ResourceImporter(scope, id, {
      arnFormat: WorkGroup.ARN_FORMAT,
      service: 'athena',
      resource: 'workgroup',
    });

    const identities = importer.resolveIdentities(attrs.arn, attrs.name);
    const props = importer.resolveProperties({
      workGroupCreationTime: attrs.creationTime,
      workGroupEffectiveEngineVersion: attrs.effectiveEngineVersion,
    });

    class Import extends WorkGroupBase {
      public readonly workGroupArn: string = identities.arn;
      public readonly workGroupCreationTime: string = Token.asString(props.workGroupCreationTime);
      public readonly workGroupEffectiveEngineVersion: string = Token.asString(props.workGroupEffectiveEngineVersion);
      public readonly workGroupName: string = identities.id;
    }

    return new Import(scope, id);
  }

  public static fromWorkGroupName(scope: IConstruct, id: string, name: string): IWorkGroup {
    return WorkGroup.fromWorkGroupAttributes(scope, id, {
      name: name,
    });
  }

  // Input properties
  public readonly description?: string;
  public readonly engine: IAnalyticsEngine;
  public readonly name: string;
  public readonly recursiveDelete: boolean;
  public readonly state?: WorkGroupState;

  // Resource properties
  public readonly resource: CfnWorkGroup;

  // Standard properties
  public readonly workGroupArn: string;
  public readonly workGroupCreationTime: string;
  public readonly workGroupEffectiveEngineVersion: string;
  public readonly workGroupName: string;


  public constructor(scope: IConstruct, id: string, props: WorkGroupProps) {
    super(scope, id, props);

    this.description = props.description;
    this.engine = props.engine ?? AnalyticsEngine.athenaSql();
    this.name = props.name ?? Names.uniqueId(this);
    this.recursiveDelete = props.recursiveDelete ?? true;
    this.state = props.state;

    const engineConfiguration = this.engine.bind(this, {
      workGroupName: this.name,
    });

    this.resource = new CfnWorkGroup(this, 'Resource', {
      description: this.description,
      name: this.name,
      recursiveDeleteOption: this.recursiveDelete,
      state: this.state?.name,
      workGroupConfiguration: {
        //additionalConfiguration: ,
        bytesScannedCutoffPerQuery: engineConfiguration.queryScannedBytesLimit?.toBytes(),
        customerContentEncryptionConfiguration: !engineConfiguration.encrpytionKey ? undefined : {
          kmsKey: engineConfiguration.encrpytionKey.keyArn,
        },
        enforceWorkGroupConfiguration: engineConfiguration.enforceConfiguration,
        engineVersion: {
          selectedEngineVersion: engineConfiguration.engineVersion?.name,
        },
        executionRole: engineConfiguration.role?.roleArn,
        publishCloudWatchMetricsEnabled: engineConfiguration.publishMetrics,
        requesterPaysEnabled: engineConfiguration.requesterPays,
        resultConfiguration: {
          //aclConfiguration: ,
          encryptionConfiguration: !engineConfiguration.resultsBucketEncryptionType ? undefined : {
            encryptionOption: engineConfiguration.resultsBucketEncryptionType,
            kmsKey: engineConfiguration.resultsBucketEncryptionKey?.keyArn,
          },
          expectedBucketOwner: engineConfiguration.expectedBucketOwner,
          outputLocation: engineConfiguration.outputLocation,
        },
      },
    });

    this.workGroupArn = this.stack.formatArn({
      arnFormat: WorkGroup.ARN_FORMAT,
      resource: 'workgroup',
      resourceName: this.resource.ref,
      service: 'athena',
    });
    this.workGroupCreationTime = this.resource.attrCreationTime;
    this.workGroupEffectiveEngineVersion = this.resource.attrWorkGroupConfigurationEngineVersionEffectiveEngineVersion;
    this.workGroupName = this.resource.ref;
  }
}
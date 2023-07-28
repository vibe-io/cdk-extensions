import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnCustomerGateway } from 'aws-cdk-lib/aws-ec2';
import { Construct, IConstruct } from 'constructs';
import { VpnConnectionType } from './vpn-connection';


/**
 * Represents a customer gateway in AWS.
 */
export interface ICustomerGateway {
  /**
   * The BGP ASN of the customer gateway.
   */
  readonly customerGatewayAsn: number;

  /**
   * The ID of the customer gateway.
   */
  readonly customerGatewayId: string;

  /**
   * The IP address of the customer gateway.
   */
  readonly customerGatewayIp: string;
}

/**
 * A base class providing common functionality between created and imported
 * customer gateways.
 */
abstract class CustomerGatewayBase extends Resource implements ICustomerGateway {
  /**
   * The BGP ASN of the customer gateway.
   */
  public abstract readonly customerGatewayAsn: number;

  /**
   * The ID of the customer gateway.
   */
  public abstract readonly customerGatewayId: string;

  /**
   * The IP address of the customer gateway.
   */
  public abstract readonly customerGatewayIp: string;
}

/**
 * Attributes used to import an existing customer gateway.
 */
export interface CustomerGatewayAttributes {
  /**
   * For devices that support BGP, the customer gateway's BGP ASN.
   */
  readonly bgpAsn?: number;

  /**
   * The ID of the existing customer gateway being imported.
   */
  readonly customerGatewayId: string;

  /**
   * The Internet-routable IP address for the customer gateway's outside
   * interface. The address must be static.
   */
  readonly ipAddress?: string;
}

/**
 * Configuration for the CustomerGateway resource.
 */
export interface CustomerGatewayProps extends ResourceProps {
  /**
   * For devices that support BGP, the customer gateway's BGP ASN.
   *
   * @see [CustomerGateway BgpAsn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-customergateway.html#cfn-ec2-customergateway-bgpasn)
   */
  readonly bgpAsn?: number;

  /**
   * The type of VPN connection that this customer gateway supports.
   *
   * @see [CustomerGateway Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-customergateway.html#cfn-ec2-customergateway-type)
   */
  readonly connectionType?: VpnConnectionType;

  /**
   * The Internet-routable IP address for the customer gateway's outside
   * interface. The address must be static.
   *
   * @see [CustomerGateway IpAddress](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-customergateway.html#cfn-ec2-customergateway-ipaddress)
   */
  readonly ipAddress: string;
}

/**
 * Specifies thje details of a remote endpoint that can serve as an endpoint
 * for connections to AWS.
 */
export class CustomerGateway extends CustomerGatewayBase {
  /**
   * Imports an existing custom gateway by specifying its details.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param attributes The details of the existing customer gateway being
   * imported.
   * @returns An object representing the imported customer gateway.
   */
  public static fromCustomerGatewayAttributes(scope: IConstruct, id: string, attributes: CustomerGatewayAttributes): ICustomerGateway {
    const bgpAsn = attributes.bgpAsn ?? Lazy.number({
      produce: () => {
        throw new Error([
          'No BGP ASN available for imported customer gateway',
          `'${scope.node.path}/${id}'.`,
        ].join( ));
      },
    });

    const ipAddress = attributes.ipAddress ?? Lazy.string({
      produce: () => {
        throw new Error([
          'No IP address available for imported customer gateway',
          `'${scope.node.path}/${id}'.`,
        ].join( ));
      },
    });

    class Import extends CustomerGatewayBase {
      public readonly customerGatewayAsn: number = bgpAsn;
      public readonly customerGatewayId: string = attributes.customerGatewayId;
      public readonly customerGatewayIp: string = ipAddress;
    }

    return new Import(scope, id);
  }

  /**
   * Imports an existing custom gateway using its CustomerGatewayId.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param customerGatewayId The ID of the existing customer gateway being
   * imported.
   * @returns An object representing the imported customer gateway.
   */
  public static fromCustomerGatewayId(scope: IConstruct, id: string, customerGatewayId: string): ICustomerGateway {
    return CustomerGateway.fromCustomerGatewayAttributes(scope, id, {
      customerGatewayId: customerGatewayId,
    });
  }

  /**
   * For devices that support BGP, the customer gateway's BGP ASN.
   *
   * @see [CustomerGateway BgpAsn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-customergateway.html#cfn-ec2-customergateway-bgpasn)
   *
   * @group Inputs
   */
  public readonly bgpAsn: number;

  /**
   * The type of VPN connection that this customer gateway supports.
   *
   * @see [CustomerGateway Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-customergateway.html#cfn-ec2-customergateway-type)
   *
   * @group Inputs
   */
  public readonly connectionType: VpnConnectionType;

  /**
   * The Internet-routable IP address for the customer gateway's outside
   * interface. The address must be static.
   *
   * @see [CustomerGateway IpAddress](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-customergateway.html#cfn-ec2-customergateway-ipaddress)
   *
   * @group Inputs
   */
  public readonly ipAddress: string;

  /**
   * The underlying CustomerGateway CloudFormation resource.
   *
   * @see [AWS::EC2::CustomerGateway](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-customergateway.html)
   *
   * @group Resources
   */
  public readonly resource: CfnCustomerGateway;

  /**
   * The BGP ASN of the customer gateway.
   */
  public readonly customerGatewayAsn: number;

  /**
    * The ID of the customer gateway.
    */
  public readonly customerGatewayId: string;

  /**
    * The IP address of the customer gateway.
    */
  public readonly customerGatewayIp: string;


  /**
   * Creates a new instance of the CustomerGateway class.
   *
   * @param scope A CDK Construct that will serve as this resource's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param props Arguments related to the configuration of the resource.
   */
  constructor(scope: Construct, id: string, props: CustomerGatewayProps) {
    super(scope, id, props);

    this.bgpAsn = props.bgpAsn ?? 65000;
    this.connectionType = props.connectionType ?? VpnConnectionType.IPSEC_1;
    this.ipAddress = props.ipAddress;

    this.resource = new CfnCustomerGateway(this, 'Resource', {
      bgpAsn: this.bgpAsn,
      ipAddress: this.ipAddress,
      type: this.connectionType.name,
    });

    this.customerGatewayAsn = this.bgpAsn;
    this.customerGatewayId = this.resource.ref;
    this.customerGatewayIp = this.ipAddress;
  }
}
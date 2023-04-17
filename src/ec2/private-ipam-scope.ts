import { ArnFormat, IResolvable, Resource, ResourceProps, Token } from 'aws-cdk-lib';
import { CfnIPAMScope } from 'aws-cdk-lib/aws-ec2';
import { IConstruct } from 'constructs';
import { IIpam } from '.';
import { IIpamPool } from './ipam-pool';
import { IIpamScope, IpamScopeAttributes } from './ipam-scope';
import { DynamicReference } from '../core/dynamic-reference';
import { ResourceImporter } from '../utils/importer';


export interface IPrivateIpamScope extends IIpamScope {
  addPool(): IIpamPool;
}

/**
 * Optional configuration for the IPAM scope resource.
 */
export interface PrivateIpamScopeOptions {
  /**
   * The description of the scope.
   *
   * @see [IPAMScope Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html#cfn-ec2-ipamscope-description)
   */
  readonly description?: string;
}

/**
 * Configuration for the IPAM scope resource.
 */
export interface PrivateIpamScopeProps extends ResourceProps, PrivateIpamScopeOptions {
  /**
   * The IPAM for which you're creating this scope.
   *
   * @see [IPAMScope IpamId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html#cfn-ec2-ipamscope-ipamid)
   */
  readonly ipam: IIpam;
}

abstract class PrivateIpamScopeBase extends Resource implements IPrivateIpamScope {
  /**
   * The ARN of the scope.
   */
  public abstract readonly ipamScopeArn: string;

  /**
    * The ID of an IPAM scope.
    */
  public abstract readonly ipamScopeId: string;

  /**
    * The ARN of an IPAM.
    */
  public abstract readonly ipamScopeIpamArn: string;

  /**
    * Defines if the scope is the default scope or not.
    */
  public abstract readonly ipamScopeIsDefault: IResolvable;

  /**
    * The number of pools in a scope.
    */
  public abstract readonly ipamScopePoolCount: number;

  /**
    * The type of the scope.
    */
  public abstract readonly ipamScopeType: string;

  public addPool(): IIpamPool {
    throw new Error('Method not implemented.');
  }
}

export class PrivateIpamScope extends PrivateIpamScopeBase {
  /**
   * The format for Amazon Resource Names (ARN's) for IPAM scope resources.
   */
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;

  /**
   * Imports an existing IPAM scope by specifying its Amazon Resource Name
   * (ARN).
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param ipamScopeArn The ARN of the existing IPAM scope to be imported.
   * @returns An object representing the imported IPAM scope.
   */
  public static fromIpamScopeArn(scope: IConstruct, id: string, ipamScopeArn: string): IPrivateIpamScope {
    return PrivateIpamScope.fromIpamScopeAttributes(scope, id, {
      ipamScopeArn: ipamScopeArn,
    });
  }

  /**
   * Imports an existing IAPM scope by explicitly specifying its attributes.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param attrs The attributes of the existing IPAM scope to be imported.
   * @returns An object representing the imported IPAM scope.
   */
  public static fromIpamScopeAttributes(scope: IConstruct, id: string, attrs: IpamScopeAttributes): IPrivateIpamScope {
    const importer = new ResourceImporter(scope, id, {
      arnFormat: PrivateIpamScope.ARN_FORMAT,
      service: 'ec2',
      resource: 'ipam-scope',
    });

    const identities = importer.resolveIdentities(attrs.ipamScopeArn, attrs.ipamScopeId);
    const props = importer.resolveProperties({
      ipamScopeIpamArn: attrs.ipam?.ipamArn,
      ipamScopeIsDefault: attrs.isDefault,
      ipamScopePoolCount: attrs.poolCount,
      ipamScopeType: attrs.scopeType,
    });

    class Import extends PrivateIpamScopeBase {
      public readonly ipamScopeArn: string = identities.arn;
      public readonly ipamScopeId: string = identities.id;
      public readonly ipamScopeIpamArn: string = Token.asString(props.ipamScopeIpamArn);
      public readonly ipamScopeIsDefault: IResolvable = Token.asAny(props.ipamScopeIsDefault);
      public readonly ipamScopePoolCount: number = Token.asNumber(props.ipamScopePoolCount);
      public readonly ipamScopeType: string = Token.asString(props.ipamScopeType);
    }

    return new Import(scope, id);
  }

  /**
   * Imports an existing IPAM scope by explicitly specifying its AWS generated
   * ID.
   *
   * @param scope A CDK Construct that will serve as this resources's parent in
   * the construct tree.
   * @param id A name to be associated with the stack and used in resource
   * naming. Must be unique within the context of 'scope'.
   * @param ipamScopeId The AWS generated ID of the existing IPAM scope to be
   * imported.
   * @returns An object representing the imported IPAM scope.
   */
  public static fromIpamScopeId(scope: IConstruct, id: string, ipamScopeId: string): IPrivateIpamScope {
    return PrivateIpamScope.fromIpamScopeAttributes(scope, id, {
      ipamScopeId: ipamScopeId,
    });
  }


  /**
   * The description of the scope.
   *
   * @see [IPAMScope Description](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html#cfn-ec2-ipamscope-description)
   *
   * @group Inputs
   */
  public readonly description?: string;

  /**
   * The IPAM for which you're creating this scope.
   *
   * @see [IPAMScope IpamId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html#cfn-ec2-ipamscope-ipamid)
   *
   * @group Inputs
   */
  public readonly ipam: IIpam;

  /**
   * The underlying IPAM scope CloudFormation resource.
   *
   * @see [AWS::EC2::IPAMScope](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html)
   *
   * @group Resources
   */
  public readonly resource: CfnIPAMScope;

  /**
   * The ARN of the scope.
   */
  public readonly ipamScopeArn: string;

  /**
   * The ID of an IPAM scope.
   */
  public readonly ipamScopeId: string;

  /**
   * The ARN of an IPAM.
   */
  public readonly ipamScopeIpamArn: string;

  /**
   * Defines if the scope is the default scope or not.
   */
  public readonly ipamScopeIsDefault: IResolvable;

  /**
   * The number of pools in a scope.
   */
  public readonly ipamScopePoolCount: number;

  /**
   * The type of the scope.
   */
  public readonly ipamScopeType: string;

  public constructor(scope: IConstruct, id: string, props: PrivateIpamScopeProps) {
    super(scope, id, props);

    this.description = props.description;
    this.ipam = props.ipam;

    this.resource = new CfnIPAMScope(this, 'Resource', {
      description: this.description,
      ipamId: this.ipam.ipamId,
    });

    this.ipamScopeArn = DynamicReference.string(this, this.resource.attrArn);
    this.ipamScopeId = DynamicReference.string(this, this.resource.ref);
    this.ipamScopeIpamArn = DynamicReference.string(this, this.resource.attrIpamArn);
    this.ipamScopeIsDefault = DynamicReference.any(this, this.resource.attrIsDefault);
    this.ipamScopePoolCount = DynamicReference.number(this, this.resource.attrPoolCount);
    this.ipamScopeType = DynamicReference.string(this, this.resource.attrIpamScopeType);
  }
}
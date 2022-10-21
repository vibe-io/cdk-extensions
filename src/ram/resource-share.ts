import { Aspects, Lazy, Names, Resource, ResourceProps, Stack, Stage, Token } from 'aws-cdk-lib';
import { CfnResourceShare } from 'aws-cdk-lib/aws-ram';
import { Construct, IConstruct } from 'constructs';
import { ISharedPrincipal, SharedPrincipal } from './lib/shared-principal';
import { ISharable } from './lib/shared-resource';


/**
 * Configuration for ResourceShare resource.
 */
export interface ResourceShareProps extends ResourceProps {
  /**
   * Specifies whether principals outside your organization in AWS
   * Organizations can be associated with a resource share. A value of `true`
   * lets you share with individual AWS accounts that are not in your
   * organization. A value of `false` only has meaning if your account is a
   * member of an AWS Organization.
   *
   * @default true
   *
   * @see [ResourceShare.AllowExternalPrinicpals](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-allowexternalprincipals)
   */
  readonly allowExternalPrincipals?: boolean;

  /**
   * Controls whether the resource share should attempt to search for AWS
   * accounts that are part of the same CDK application. Any accounts is finds
   * will be added to the resource automatically and will be able to use the
   * shared resources.
   */
  readonly autoDiscoverAccounts?: boolean;

  /**
   * Specifies the name of the resource share.
   *
   * @see [ResourceShare.Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-name)
   */
  readonly name?: string;

  /**
   * Specifies a list of one or more principals to associate with the resource share.
   *
   * @see [ResourceShare.Prinicipals](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-principals)
   */
  readonly principals?: ISharedPrincipal[];

  /**
   * Specifies a list of AWS resources to share with the configured principal
   * accounts and organizations.
   *
   * @see [ResourceShare.ResourceArns](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-resourcearns)
   */
  readonly resources?: ISharable[];
}

/**
 * Creates a resource share that can used to share AWS resources with other AWS
 * accounts, organizations, or organizational units (OU's).
 *
 * @see [AWS::RAM::ResourceShare](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html)
 */
export class ResourceShare extends Resource {
  // Internal properties
  private _autoDiscovery: boolean = false;
  private readonly _principals: ISharedPrincipal[] = [];
  private readonly _resources: ISharable[] = [];

  /**
   * Specifies whether principals outside your organization in AWS
   * Organizations can be associated with a resource share. A value of `true`
   * lets you share with individual AWS accounts that are not in your
   * organization. A value of `false` only has meaning if your account is a
   * member of an AWS Organization.
   *
   * In order for an account to be auto discovered it must be part of the same
   * CDK application. It must also be an explicitly defined environment and not
   * environment agnostic.
   *
   * @group Inputs
   *
   * @see [ResourceShare.AllowExternalPrinicpals](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-allowexternalprincipals)
   * @see [CDK Environments](https://docs.aws.amazon.com/cdk/v2/guide/environments.html)
   */
  public readonly allowExternalPrincipals?: boolean;

  /**
   * Specifies the name of the resource share.
   *
   * @group Inputs
   *
   * @see [ResourceShare.Name](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html#cfn-ram-resourceshare-name)
   */
  public readonly name: string;


  /**
   * The underlying ResourceShare CloudFormation resource.
   *
   * @see [AWS::RAM::ResourceShare](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ram-resourceshare.html)
   *
   * @group Resources
   */
  public readonly resource: CfnResourceShare;

  /**
   *
   */
  public get autoDiscovery(): boolean {
    return this._autoDiscovery;
  }


  /**
     * Creates a new instance of the ResourceShare class.
     *
     * @param scope A CDK Construct that will serve as this stack's parent in the construct tree.
     * @param id A name to be associated with the stack and used in resource naming. Must be unique
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
  constructor(scope: Construct, id: string, props: ResourceShareProps = {}) {
    super(scope, id, props);

    this.allowExternalPrincipals = props.allowExternalPrincipals;
    this.name = props.name ?? Names.uniqueId(this);

    this.resource = new CfnResourceShare(this, 'Resource', {
      allowExternalPrincipals: this.allowExternalPrincipals,
      name: this.name,
      principals: Lazy.uncachedList({
        produce: () => {
          return this._principals.map((x) => {
            return x.bind(this);
          });
        },
      }),
      resourceArns: Lazy.uncachedList({
        produce: () => {
          return this._resources.map((x) => {
            return x.share(this);
          });
        },
      }),
    });
  }

  public addPrincipal(principal: ISharedPrincipal): void {
    this._principals.push(principal);
  }

  public addResource(resource: ISharable): void {
    this._resources.push(resource);
  }

  private autoDiscover(): void {
    const accounts = new Set(this.node.root.node.findAll().reduce((prev, cur) => {
      if (cur instanceof Stage && cur.account && !Token.isUnresolved(cur.account)) {
        prev.push(cur.account);
      } else if (cur instanceof Stack && !Token.isUnresolved(cur.account)) {
        prev.push(cur.account);
      }

      return prev;
    }, [] as string[]).filter((x) => {
      return x !== this.stack.account;
    }));

    accounts.forEach((x) => {
      this.addPrincipal(SharedPrincipal.fromAccountId(x));
    });
  }

  public enableAutoDiscovery(): void {
    if (!this.autoDiscovery) {
      Aspects.of(this).add({
        visit: (node: IConstruct) => {
          if (node === this) {
            this.autoDiscover();
          }
        },
      });
      this._autoDiscovery = true;
    }
  }
}
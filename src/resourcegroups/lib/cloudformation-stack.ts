import { Lazy, Stack } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { BoundGroupConfiguration, IGroupConfiguration } from './configuration-ref';


export interface IStackReference {
  readonly stackConstruct?: Stack;
  readonly stackId: string;
}

export class StackReference {
  public static fromStackId(stackId: string): IStackReference {
    return {
      stackId: stackId,
    };
  }

  public static fromStack(stack: Stack): IStackReference {
    return {
      stackConstruct: stack,
      stackId: stack.stackId,
    };
  }
}

export interface CloudFormationStackProps {
  readonly resourceTypes?: string[];
}

/**
 * Configuration object for a Resource Group whose resources mirror those
 * controlled by a CloudFormation stack.
 */
export class CloudFormationStack implements IGroupConfiguration {
  /**
   * Internal collection of resource types that are allowed to be in the
   * Resource Group being configured.
   */
  private readonly _resourceTypes: Set<string>;

  /**
   * The details of the CloudFormation stack that is referenced to create the
   * Resource Group.
   */
  public readonly reference: IStackReference;

  /**
   * Collection of resource types that are allowed to be in the Resource Group
   * being configured.
   */
  public get resourceTypes(): string[] {
    return Array.from(this._resourceTypes);
  }


  /**
   * Creates a new instance of the CloudFormationStack class.
   *
   * @param reference A reference to a CloudFormation stack that determines the
   * resources to be contained in the Resource Group.
   */
  public constructor(reference: IStackReference, props: CloudFormationStackProps = {}) {
    this._resourceTypes = new Set<string>();

    this.reference = reference;

    props.resourceTypes?.forEach((x) => {
      this.addResourceType(x);
    });
  }

  /**
   * Add a resource type to the resource group.
   *
   * If no resource types are registered in the configuration then all resource
   * types are allowed.
   *
   * @param typeId The type that is to be added to the resource group.
   * @returns The Resource Group configuration object to which the type was
   * registered.
   */
  public addResourceType(typeId: string): CloudFormationStack {
    this._resourceTypes.add(typeId);
    return this;
  }

  /**
   * Associates this configuration with a construct that is handling the
   * creation of a resource group.
   *
   * @param _scope The construct managing the creation of the Resource Group.
   * @returns The configuration to be used for the Resource Group.
   */
  public bind(_scope: IConstruct): BoundGroupConfiguration {
    return {
      query: {
        query: {
          resourceTypeFilters: Lazy.list(
            {
              produce: () => {
                return this.resourceTypes;
              },
            },
            {
              omitEmpty: true,
            },
          ),
          stackIdentifier: this.reference.stackId,
        },
        type: 'CLOUDFORMATION_STACK_1_0',
      },
    };
  }
}
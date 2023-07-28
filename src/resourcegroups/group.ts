import { ArnFormat, Names, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnGroup } from 'aws-cdk-lib/aws-resourcegroups';
import { IConstruct } from 'constructs';
import { IGroupConfiguration } from './lib/configuration-ref';
import { ResourceImporter } from '../utils/importer';


export interface IGroup {
  readonly groupArn: string;
  readonly groupName: string;
}

abstract class GroupBase extends Resource implements IGroup {
  public abstract readonly groupArn: string;
  public abstract readonly groupName: string;


  public constructor(scope: IConstruct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
  }
}

export interface GroupAttributes {
  readonly arn?: string;
  readonly name?: string;
}

export interface GroupProps extends ResourceProps {
  readonly configuration: IGroupConfiguration;
  readonly description?: string;
  readonly name?: string;
}

export class Group extends GroupBase {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;

  public static fromGroupArn(scope: IConstruct, id: string, arn: string): IGroup {
    return Group.fromGroupAttributes(scope, id, {
      arn: arn,
    });
  }

  public static fromGroupAttributes(scope: IConstruct, id: string, attrs: GroupAttributes): IGroup {
    const importer = new ResourceImporter(scope, id, {
      arnFormat: Group.ARN_FORMAT,
      service: 'resource-groups',
      resource: 'group',
    });

    const identities = importer.resolveIdentities(attrs.arn, attrs.name);

    class Import extends GroupBase {
      public readonly groupArn: string = identities.arn;
      public readonly groupName: string = identities.id;
    }

    return new Import(scope, id);
  }

  public static fromGroupName(scope: IConstruct, id: string, name: string): IGroup {
    return Group.fromGroupAttributes(scope, id, {
      name: name,
    });
  }


  // Input properties
  public readonly description?: string;
  public readonly name: string;

  // Resource properties
  public readonly resource: CfnGroup;

  // Standard properties
  public readonly groupArn: string;
  public readonly groupName: string;


  public constructor(scope: IConstruct, id: string, props: GroupProps) {
    super(scope, id, props);

    this.description = props.description;
    this.name = props.name ?? Names.uniqueId(this);

    const config = props.configuration.bind(this);

    if (!config.configuration && !config.query) {
      throw new Error([
        'Resource group configuration must resolve to an object containing at',
        'least a query or resource group configuration.',
      ].join(' '));
    }

    this.resource = new CfnGroup(this, 'Resource', {
      configuration: config.configuration,
      description: this.description,
      name: this.name,
      resourceQuery: config.query,
      //resources: ,
    });

    this.groupArn = this.resource.attrArn;
    this.groupName = this.resource.ref;
  }
}
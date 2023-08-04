import { ArnFormat, Resource, ResourceProps } from "aws-cdk-lib";
import { CfnHub } from "aws-cdk-lib/aws-securityhub";
import { IConstruct } from "constructs";
import { ResourceImporter } from "../utils/importer";


export class ControlFindingGenerator {
  public static readonly SECURITY_CONTROL: ControlFindingGenerator = ControlFindingGenerator.of('SECURITY_CONTROL');
  public static readonly STANDARD_CONTROL: ControlFindingGenerator = ControlFindingGenerator.of('STANDARD_CONTROL');

  static of(value: string): ControlFindingGenerator {
    return new ControlFindingGenerator(value);
  }


  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }
}

export interface IHub {
  readonly hubArn: string;
  readonly hubName: string;
}

abstract class HubBase extends Resource implements IHub {
  public abstract readonly hubArn: string;
  public abstract readonly hubName: string;
}

export interface HubProps extends ResourceProps {
  readonly autoEnableControls?: boolean;
  readonly consolidatedFindings?: boolean;
  readonly enableDefaultStandards?: boolean;
}

export interface HubAttributes {
  readonly arn?: string;
  readonly name?: string;
}

export class Hub extends HubBase {
  public static readonly ARN_FORMAT: ArnFormat = ArnFormat.SLASH_RESOURCE_NAME;

  public static fromHubArn(scope: IConstruct, id: string, arn: string): IHub {
    return Hub.fromHubAttributes(scope, id, {
      arn: arn,
    });
  }

  public static fromHubAttributes(scope: IConstruct, id: string, attrs: HubAttributes): IHub {
    const importer = new ResourceImporter(scope, id, {
      arnFormat: Hub.ARN_FORMAT,
      service: 'securityhub',
      resource: 'hub',
    });
    
    const identities = importer.resolveIdentities(attrs.arn, attrs.name);
    
    class Import extends HubBase {
      public readonly hubArn = identities.arn;
      public readonly hubName = identities.id;
    }

    return new Import(scope, id);
  }

  public static fromHubName(scope: IConstruct, id: string, name: string): IHub {
    return Hub.fromHubAttributes(scope, id, {
      name: name,
    });
  }


  public readonly autoEnableControls?: boolean;
  public readonly consolidatedFindings?: boolean;
  public readonly controlFindingGenerator?: ControlFindingGenerator;
  public readonly enableDefaultStandards?: boolean;

  public readonly resource: CfnHub;

  public readonly hubArn: string;
  public readonly hubName: string;


  public constructor(scope: IConstruct, id: string, props: HubProps = {}) {
    super(scope, id, props);

    this.autoEnableControls = props.autoEnableControls;
    this.consolidatedFindings = props.consolidatedFindings;
    this.enableDefaultStandards = props.enableDefaultStandards;
    
    if (this.consolidatedFindings === true) {
      this.controlFindingGenerator = ControlFindingGenerator.SECURITY_CONTROL;
    }
    else if (this.consolidatedFindings === false) {
      this.controlFindingGenerator = ControlFindingGenerator.STANDARD_CONTROL;
    }

    this.resource = new CfnHub(this, 'Resource', {
      autoEnableControls: this.autoEnableControls,
      controlFindingGenerator: this.controlFindingGenerator?.value,
      enableDefaultStandards: this.enableDefaultStandards,
    });

    this.hubArn = this.resource.ref;
    this.hubName = this.stack.splitArn(this.resource.ref, Hub.ARN_FORMAT).resourceName!;
  }
}
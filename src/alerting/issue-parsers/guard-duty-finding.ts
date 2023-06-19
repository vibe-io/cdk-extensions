import { Duration } from 'aws-cdk-lib';
import { Chain, Choice, Condition, IStateMachine, Pass, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import { IConstruct } from 'constructs';
import { IssueParserPluginBase } from './issue-parser-plugin-base';
import { SfnFn } from '../../stepfunctions';
import { IssueHandlerOverride } from '../issue-handler-override';
import { IssuePluginBaseProps } from '../issue-plugin-base';
import { IssueTrigger } from '../issue-trigger';


export class GuardDutySeverity {
  public static readonly INFORMATIONAL: GuardDutySeverity = GuardDutySeverity.of('INFO', undefined, 1);
  public static readonly LOW: GuardDutySeverity = GuardDutySeverity.of('LOW', 1, 4);
  public static readonly MEDIUM: GuardDutySeverity = GuardDutySeverity.of('MEDIUM', 4, 7);
  public static readonly HIGH: GuardDutySeverity = GuardDutySeverity.of('HIGH', 7, 8);
  public static readonly CRITICAL: GuardDutySeverity = GuardDutySeverity.of('CRITICAL', 8, undefined);

  public static of(standardized: string, lowerBound?: number, upperBound?: number): GuardDutySeverity {
    return new GuardDutySeverity(standardized, lowerBound, upperBound);
  }


  public static all(): GuardDutySeverity[] {
    return [...GuardDutyFinding.SEVERITIES];
  }

  public static custom(...levels: GuardDutySeverity[]): GuardDutySeverity[] {
    return [...levels];
  }

  public static threshold(level: GuardDutySeverity): GuardDutySeverity[] {
    return GuardDutyFinding.SEVERITIES.filter((x) => {
      if (level.lowerBound === undefined) {
        return true;
      } else if (x.lowerBound === undefined) {
        return false;
      } else {
        return x.lowerBound >= level.lowerBound;
      }
    });
  }


  public readonly lowerBound?: number;
  public readonly standardized: string;
  public readonly upperBound?: number;

  private constructor(standardized: string, lowerBound?: number, upperBound?: number) {
    if (lowerBound === undefined && upperBound === undefined) {
      throw new Error([
        'A Guard Duty severity must have at least an upper bound or a lower',
        'bound.',
      ].join(' '));
    }

    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.standardized = standardized;
  }

  public buildCondition(path: string): Condition {
    if (this.upperBound === undefined) {
      return Condition.numberGreaterThanEquals(path, this.lowerBound!);
    } else if (this.lowerBound === undefined) {
      return Condition.numberLessThan(path, this.upperBound);
    } else {
      return Condition.and(
        Condition.numberGreaterThanEquals(path, this.lowerBound),
        Condition.numberLessThan(path, this.upperBound),
      );
    }
  }
}

export interface GuardDutyFindingRuleOptions {
  readonly overrides?: IssueHandlerOverride[];
  readonly severity?: GuardDutySeverity[];
}

export interface GuardDutyFindingProps extends IssuePluginBaseProps {}

export class GuardDutyFinding extends IssueParserPluginBase {
  public static readonly MATCH_TYPE: string = 'GuardDutyFinding';
  public static readonly SEVERITIES: GuardDutySeverity[] = [
    GuardDutySeverity.INFORMATIONAL,
    GuardDutySeverity.LOW,
    GuardDutySeverity.MEDIUM,
    GuardDutySeverity.HIGH,
    GuardDutySeverity.CRITICAL,
  ];

  // Input properties
  public readonly name?: string;
  public readonly timeout?: Duration;

  // Resource props
  public readonly handler: IStateMachine;

  public get triggers(): IssueTrigger[] {
    return this.node.children.filter((x) => {
      return x instanceof IssueTrigger;
    }) as IssueTrigger[];
  }


  public constructor(scope: IConstruct, id: string, props: GuardDutyFindingProps = {}) {
    super(scope, id, props);

    const findingUrl = [
      `https://${this.stack.region}.console.aws.amazon.com`,
      'guardduty',
      `home?region=${this.stack.region}#`,
      'findings?macros=current&fId={}',
    ].join('/');

    const baseDescription = [
      'AWS Guard Duty detected a potential {} level security event. Details',
      `of the event can be reviewed at the following link:\n${findingUrl}`,
    ].join(' ');

    const extractDetail = new Pass(this, 'extract-detail', {
      parameters: {
        'Detail.$': '$.detail',
      },
    });

    const mapSeverity = this.buildSeverityMap();

    const initializeDescriptionBuilder = new Pass(this, 'initialize-description-builder', {
      parameters: {
        'Builder.$': SfnFn.format(baseDescription, [
          '$.Severity.Text',
          '$.Detail.id',
        ]),
      },
      resultPath: '$.Description',
    });

    const processInstance = this.addInstanceDetails();
    const processLambda = this.addLambdaDetails();
    const processRdsDbInstance = this.addRdsDbInstanceDetails();
    const processEcsCluster = this.addEcsClusterDetails();
    const processEksCluster = this.addEksClusterDetails();
    const processKubernetes = this.addKubernetesDetails();
    const processContainer = this.addContainerDetails();
    const processS3Bucket = this.addS3BucketDetails();
    const processAccessKey = this.addAccessKeyDetails();

    const formatOutput = new Pass(this, 'format-output', {
      parameters: {
        'Description.$': '$.Description.Builder',
        'Severity.$': '$.Severity.Standardized',
        'Summary.$': SfnFn.format('Guard Duty - {}', [
          '$.Detail.title',
        ]),
      },
    });

    const definition = extractDetail
      .next(mapSeverity)
      .next(initializeDescriptionBuilder)
      .next(processInstance)
      .next(processLambda)
      .next(processRdsDbInstance)
      .next(processEcsCluster)
      .next(processEksCluster)
      .next(processKubernetes)
      .next(processContainer)
      .next(processS3Bucket)
      .next(processAccessKey)
      .next(formatOutput);

    this.handler = new StateMachine(this, 'state-machine', {
      definition: definition,
      logs: this.buildLogging(),
      stateMachineName: this.name,
      stateMachineType: StateMachineType.EXPRESS,
      timeout: this.timeout,
      tracingEnabled: true,
    });
  }

  private addAccessKeyDetails(): Chain {
    const sectionId = 'access-key';
    const sectionHeader = 'Access Key';
    const sectionPath = '$.Detail.resource.accessKeyDetails';

    return this.addSectionCheck(sectionId, sectionPath,
      this.addSectionHeader(sectionId, sectionHeader)
        .next(this.addSectionField(`${sectionId}-id`, 'ID', `${sectionPath}.accessKeyId`))
        .next(this.addSectionField(`${sectionId}-principal`, 'Principal', `${sectionPath}.principalId`))
        .next(this.addSectionField(`${sectionId}-username`, 'Username', `${sectionPath}.userName`))
        .next(this.addSectionField(`${sectionId}-usertype`, 'User type', `${sectionPath}.userType`)));
  }

  private addContainerDetails(): Chain {
    const sectionId = 'container';
    const sectionHeader = 'Container';
    const sectionPath = '$.Detail.resource.containerDetails';

    return this.addSectionCheck(sectionId, sectionPath,
      this.addSectionHeader(sectionId, sectionHeader)
        .next(this.addSectionField(`${sectionId}-name`, 'Name', `${sectionPath}.name`))
        .next(this.addSectionField(`${sectionId}-id`, 'ID', `${sectionPath}.id`))
        .next(this.addSectionField(`${sectionId}-image`, 'Image', `${sectionPath}.image`))
        .next(this.addSectionField(`${sectionId}-runtime`, 'Runtime', `${sectionPath}.containerRuntime`))
        .next(this.addSectionField(`${sectionId}-privileged`, 'Privileged', `${sectionPath}.privileged`)));
  }

  protected addDefaultTrigger(): IssueTrigger {
    return this.registerIssueTrigger('default');
  }

  private addEcsClusterDetails(): Chain {
    const sectionId = 'ecs-cluster';
    const sectionHeader = 'ECS Cluster';
    const sectionPath = '$.Detail.resource.ecsClusterDetails';

    return this.addSectionCheck(sectionId, sectionPath,
      this.addSectionHeader(sectionId, sectionHeader)
        .next(this.addSectionField(`${sectionId}-name`, 'Name', `${sectionPath}.name`))
        .next(this.addSectionField(`${sectionId}-arn`, 'ARN', `${sectionPath}.arn`))
        .next(this.addSectionField(`${sectionId}-task-arn`, 'Task ARN', `${sectionPath}.taskDetails.arn`))
        .next(this.addSectionField(`${sectionId}-taskdef-arn`, 'Task Definition ARN', `${sectionPath}.taskDetails.definitionArn`))
        .next(this.addSectionField(`${sectionId}-taskdef-version`, 'Task Definition Version', `${sectionPath}.taskDetails.version`))
        .next(this.addSectionField(`${sectionId}-started-by`, 'Task Started By', `${sectionPath}.taskDetails.startedBy`))
        .next(this.addSectionField(`${sectionId}-task-group`, 'Task Group', `${sectionPath}.taskDetails.group`)));
  }

  private addEksClusterDetails(): Chain {
    const sectionId = 'eks-cluster';
    const sectionHeader = 'EKS Cluster';
    const sectionPath = '$.Detail.resource.eksClusterDetails';

    return this.addSectionCheck(sectionId, sectionPath,
      this.addSectionHeader(sectionId, sectionHeader)
        .next(this.addSectionField(`${sectionId}-name`, 'Name', `${sectionPath}.name`))
        .next(this.addSectionField(`${sectionId}-arn`, 'ARN', `${sectionPath}.arn`)));
  }

  private addInstanceDetails(): Chain {
    const sectionId = 'instance';
    const sectionHeader = 'Instance';
    const sectionPath = '$.Detail.resource.instanceDetails';

    return this.addSectionCheck(sectionId, sectionPath,
      this.addSectionHeader(sectionId, sectionHeader)
        .next(this.addSectionField(`${sectionId}-id`, 'ID', `${sectionPath}.instanceId`)));
  }

  private addKubernetesDetails(): Chain {
    const sectionId = 'kubernetes';
    const sectionHeader = 'Kubernetes';
    const sectionPath = '$.Detail.resource.kubernetesDetails';

    return this.addSectionCheck(sectionId, sectionPath,
      this.addSectionHeader(sectionId, sectionHeader)
        .next(this.addSectionField(`${sectionId}-username`, 'Username', `${sectionPath}.kubernetesUserDetails.username`))
        .next(this.addSectionField(`${sectionId}-userid`, 'User ID', `${sectionPath}.kubernetesUserDetails.uid`))
        .next(this.addSectionField(`${sectionId}-namespace`, 'Namespace', `${sectionPath}.kubernetesWorkloadDetails.namespace`))
        .next(this.addSectionField(`${sectionId}-workload-name`, 'Workload name', `${sectionPath}.kubernetesWorkloadDetails.name`))
        .next(this.addSectionField(`${sectionId}-workload-type`, 'Workload type', `${sectionPath}.kubernetesWorkloadDetails.type`))
        .next(this.addSectionField(`${sectionId}-workload-id`, 'Workload ID', `${sectionPath}.kubernetesWorkloadDetails.uid`)));
  }

  private addLambdaDetails(): Chain {
    const sectionId = 'lambda';
    const sectionHeader = 'Lambda';
    const sectionPath = '$.Detail.resource.lambdaDetails';

    return this.addSectionCheck(sectionId, sectionPath,
      this.addSectionHeader(sectionId, sectionHeader)
        .next(this.addSectionField(`${sectionId}-name`, 'Name', `${sectionPath}.functionName`))
        .next(this.addSectionField(`${sectionId}-arn`, 'ARN', `${sectionPath}.functionArn`))
        .next(this.addSectionField(`${sectionId}-version`, 'Version', `${sectionPath}.functionVersion`))
        .next(this.addSectionField(`${sectionId}-role`, 'Role', `${sectionPath}.role`)));
  }

  private addRdsDbInstanceDetails(): Chain {
    const sectionId = 'rds-db-instance';
    const sectionHeader = 'RDS DB Instance';
    const sectionPath = '$.Detail.resource.rdsDbInstanceDetails';

    return this.addSectionCheck(sectionId, sectionPath,
      this.addSectionHeader(sectionId, sectionHeader)
        .next(this.addSectionField(`${sectionId}-instance-id`, 'Instance ID', `${sectionPath}.dbInstanceIdentifier`))
        .next(this.addSectionField(`${sectionId}-cluster-id`, 'Cluster ID', `${sectionPath}.dbClusterIdentifier`))
        .next(this.addSectionField(`${sectionId}-arn`, 'ARN', `${sectionPath}.dbInstanceArn`))
        .next(this.addSectionField(`${sectionId}-engine`, 'Engine', `${sectionPath}.engine`))
        .next(this.addSectionField(`${sectionId}-engine-version`, 'Engine Version', `${sectionPath}.engineVersion`)));
  }

  private addS3BucketDetails(): Chain {
    const sectionId = 's3-bucket';
    const sectionHeader = 'S3 Bucket';
    const sectionPath = '$.Detail.resource.s3BucketDetails';

    return this.addSectionCheck(sectionId, sectionPath,
      this.addSectionHeader(sectionId, sectionHeader)
        .next(this.addSectionField(`${sectionId}-name`, 'Name', `${sectionPath}.name`))
        .next(this.addSectionField(`${sectionId}-arn`, 'ARN', `${sectionPath}.arn`)),
    );
  }

  private addSectionCheck(id: string, path: string, chain: Chain): Chain {
    return new Choice(this, `section-check-${id}`)
      .when(Condition.isPresent(path), chain)
      .afterwards({ includeOtherwise: true });
  }

  private addSectionHeader(id: string, section: string): Pass {
    return new Pass(this, `add-${id}-header`, {
      parameters: {
        'Builder.$': SfnFn.format(`{}\n\n${section} details:`, [
          '$.Description.Builder',
        ]),
      },
      resultPath: '$.Description',
    });
  }

  public addSectionField(id: string, key: string, path: string): Chain {
    const check = new Choice(this, `field-check-${id}`);

    const add = new Pass(this, `field-add-${id}`, {
      parameters: {
        'Builder.$': SfnFn.format(`{}\n${key}: {}`, [
          '$.Description.Builder',
          path,
        ]),
      },
      resultPath: '$.Description',
    });

    return check
      .when(Condition.isPresent(path), add)
      .afterwards({ includeOtherwise: true });
  }

  public bind(_scope: IConstruct): IssueTrigger[] {
    if (this.triggers.length === 0) {
      this.registerIssueTrigger('default');
    }

    return this.triggers;
  }

  protected buildSeverityMap(): Chain {
    const severityPath = '$.Detail.severity';

    const checkSeverity = new Choice(this, 'check-severity');

    GuardDutyFinding.SEVERITIES.reverse().forEach((x) => {
      const setSeverity = new Pass(this, `set-${x.standardized.toLowerCase()}`, {
        parameters: {
          'Original.$': severityPath,
          'Standardized': x.standardized.toUpperCase(),
          'Text': x.standardized.toUpperCase(),
        },
        resultPath: '$.Severity',
      });

      checkSeverity.when(x.buildCondition(severityPath), setSeverity);
    });

    const setUnknown = new Pass(this, 'set-unknown', {
      parameters: {
        Text: 'UNKNOWN',
      },
      resultPath: '$.Severity',
    });

    return checkSeverity
      .otherwise(setUnknown)
      .afterwards();
  }

  public registerIssueTrigger(id: string, options: GuardDutyFindingRuleOptions = {}): IssueTrigger {
    const severityLevels = options.severity ?? GuardDutySeverity.threshold(GuardDutySeverity.CRITICAL);

    const matches = severityLevels.map((x) => {
      const op: any[] = [];

      if (x.lowerBound) {
        op.push('>=', x.lowerBound);
      }
      if (x.upperBound) {
        op.push('<', x.upperBound);
      }

      return {
        numeric: op,
      };
    });

    return new IssueTrigger(this, `trigger-${id}`, {
      eventPattern: {
        detail: {
          severity: matches,
        },
        detailType: [
          'GuardDuty Finding',
        ],
        source: [
          'aws.guardduty',
        ],
      },
      overrides: options.overrides,
      parser: this,
    });
  }
}
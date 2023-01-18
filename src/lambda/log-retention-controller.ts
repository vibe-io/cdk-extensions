import { Resource, ResourceProps } from 'aws-cdk-lib';
import { Rule } from 'aws-cdk-lib/aws-events';
import { SfnStateMachine } from 'aws-cdk-lib/aws-events-targets';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IConstruct } from 'constructs';


export interface LogRetentionControllerProps extends ResourceProps {
  readonly retention?: RetentionDays;
}

export class LogRetentionController extends Resource {
  // Input properties
  public readonly retention: RetentionDays;

  // Resource properties
  public readonly logGroupCreatedRule: Rule;
  public readonly stateMachine: StateMachine;


  public constructor(scope: IConstruct, id: string, props: LogRetentionControllerProps = {}) {
    super(scope, id, props);

    this.retention = props.retention ?? RetentionDays.TWO_WEEKS;

    const putRetentionPolicy = new CallAwsService(this, 'put-retention-policy', {
      action: 'putRetentionPolicy',
      iamResources: [
        '*',
      ],
      parameters: {
        'logGroupName.$': '$.logGroupName',
        'retentionInDays.$': '$.retentionInDays',
      },
      service: 'logs',
    });

    this.stateMachine = new StateMachine(this, 'state-machine', {
      definition: putRetentionPolicy,
    });

    this.logGroupCreatedRule = new Rule(this, 'log-group-created-rule', {
      description: 'Detects the creation of log groups tied to Lambda functions.',
      enabled: true,
      eventPattern: {
        detail: {
          eventName: [
            'CreateLogGroup',
          ],
          eventSource: [
            'logs.amazonaws.com',
          ],
        },
        detailType: [
          'AWS API Call via CloudTrail',
        ],
        source: [
          'aws.logs',
        ],
      },
      targets: [
        new SfnStateMachine(this.stateMachine),
      ],
    });
  }
}
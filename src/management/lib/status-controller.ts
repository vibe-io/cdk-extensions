import { Duration } from "aws-cdk-lib";
import { Choice, Condition, Fail, IChainable, Pass, Succeed, Wait, WaitTime } from "aws-cdk-lib/aws-stepfunctions";
import { CallAwsService } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct, IConstruct } from "constructs";
import { SfnFn } from "../../stepfunctions";


export interface StatusControllerActionProps {
  readonly action: string;
  readonly iamResources: string[];
  readonly parameters?: {[key: string]: any};
  readonly resultSelector?: {[key: string]: any};
  readonly service: string;
}

export interface StatusControllerUnmatchedErrorProps {
  readonly error?: string;
  readonly cause?: string;
}

export interface StatusControllerProps {
  readonly maxRetries?: number;
  readonly readyCondition: Condition;
  readonly statusGetter: StatusControllerActionProps;
  readonly statusSetter: StatusControllerActionProps;
  readonly successCondition: Condition;
  readonly ttl?: number;
  readonly unmatchedError?: StatusControllerUnmatchedErrorProps;
  readonly waitCondition: Condition;
}

export class StatusController extends Construct {
  private static readonly DEFAULT_LIFECYCLE_PATH: string = '$.StatusController.Lifecycle';
  private static readonly DEFAULT_RESULT_PATH: string = '$.StatusController.Result';
  private static readonly DEFAULT_STATUS_PATH: string = '$.StatusController.Current';

  public static resultRef(path: string): string {
    return `${StatusController.DEFAULT_RESULT_PATH}.${path}`;
  }

  public static statusRef(path: string): string {
    return `${StatusController.DEFAULT_STATUS_PATH}.${path}`;
  }

  public static readonly DEFAULT_MAX_RETRIES: number = 3;
  public static readonly DEFAULT_TTL: number = 120;

  private readonly lifecyclePath: string;

  private readonly addTtl: Pass;
  private readonly checkStatus: Choice;
  private readonly decrementTtl: Pass;
  private readonly getCurrentStatus: CallAwsService;
  private readonly maxRetriesExceeded: Fail;
  private readonly pollDelay: Wait;
  private readonly resetTtl: Pass;
  private readonly setDesiredStatus: CallAwsService;
  private readonly ttlExceeded: Fail;
  private readonly unmatched?: Fail;

  private readonly readyCondition: Condition;
  private readonly successCondition: Condition;
  private readonly maxAttemptsExceededCondition: Condition;
  private readonly ttlExceededCondition: Condition;
  private readonly waitCondition: Condition;

  public readonly maxRetries: number;
  public readonly ttl: number;
  
  public readonly success: Succeed;


  public constructor(scope: IConstruct, id: string, props: StatusControllerProps) {
    super(scope, id);

    this.lifecyclePath = StatusController.DEFAULT_LIFECYCLE_PATH

    this.maxRetries = props.maxRetries ?? StatusController.DEFAULT_MAX_RETRIES;
    this.ttl = props.ttl ?? StatusController.DEFAULT_TTL;

    this.addTtl = new Pass(this, 'add-ttl', {
      parameters: {
        'RemainingAttempts': this.maxRetries,
        'Ttl': this.ttl,
      },
      resultPath: this.lifecyclePath,
    });

    this.getCurrentStatus = new CallAwsService(this, 'get-current-status', {
      action: props.statusGetter.action,
      iamResources: props.statusGetter.iamResources,
      parameters: props.statusGetter.parameters,
      resultPath: StatusController.DEFAULT_STATUS_PATH,
      resultSelector: props.statusGetter.resultSelector,
      service: props.statusGetter.service,
    });

    this.setDesiredStatus = new CallAwsService(this, 'set-desired-status', {
      action: props.statusSetter.action,
      iamResources: props.statusSetter.iamResources,
      parameters: props.statusSetter.parameters,
      resultPath: StatusController.DEFAULT_RESULT_PATH,
      resultSelector: props.statusSetter.resultSelector,
      service: props.statusSetter.service,
    });

    this.checkStatus = new Choice(this, 'check-status');
    this.readyCondition = Condition.and(
      Condition.numberGreaterThan(`${this.lifecyclePath}}.RemainingAttempts`, 0),
      props.readyCondition,
    );
    this.successCondition = props.successCondition;
    this.maxAttemptsExceededCondition = props.readyCondition;
    this.ttlExceededCondition = Condition.numberLessThanEquals('$.Lifecycle.Ttl', 0);
    this.waitCondition = props.waitCondition;

    this.decrementTtl = new Pass(this, 'decrement-ttl', {
      parameters: {
        'RemainingAttempts.$': `${this.lifecyclePath}.RemainingAttempts`,
        'Ttl.$': SfnFn.mathAdd(`${this.lifecyclePath}.Ttl`, -1),
      },
      resultPath: this.lifecyclePath,
    });

    this.pollDelay = new Wait(this, 'poll-delay', {
      time: WaitTime.duration(Duration.seconds(15)),
    });

    this.resetTtl = new Pass(this, 'reset-ttl', {
      parameters: {
        'RemainingAttempts.$': SfnFn.mathAdd(`${this.lifecyclePath}.RemainingAttempts`, -1),
        'Ttl': this.ttl,
      },
      resultPath: this.lifecyclePath,
    });

    this.success = new Succeed(this, 'success');

    this.maxRetriesExceeded = new Fail(this, 'max-retries-exceeded', {
      cause: 'The operation exceeded the maximum number of automatic retries.',
      error: 'MaxRetriesExceededError',
    });

    this.ttlExceeded = new Fail(this, 'ttl-exceeded', {
      cause: 'Operation failed because the resource failed to reach the a desired state within the timeout period.',
      error: 'TtlExceededError',
    });

    if (props.unmatchedError) {
      this.unmatched = new Fail(this, 'unmatched-status', {
        cause: props.unmatchedError.cause,
        error: props.unmatchedError.error,
      });
    }
  }

  public render(): IChainable {
    const closeLoop = this.pollDelay.next(this.getCurrentStatus);

    let conditional = this.checkStatus
      .when(this.waitCondition, this.decrementTtl.next(closeLoop))
      .when(this.readyCondition, this.setDesiredStatus.next(this.resetTtl).next(closeLoop))
      .when(this.maxAttemptsExceededCondition, this.maxRetriesExceeded)
      .when(this.successCondition, this.success)
      .when(this.ttlExceededCondition, this.ttlExceeded);

    if (this.unmatched) {
      conditional = conditional.otherwise(this.unmatched);
    }

    return this.addTtl.next(this.getCurrentStatus).next(conditional);
  }
}
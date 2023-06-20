import { Chain, Choice, Condition, IChainable, INextable, Pass, State } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct, IConstruct } from 'constructs';
import { SfnFn } from '../lib';


export interface StringReplaceProps {
  readonly inputString: string;
  readonly outputKey: string;
  readonly search: string;
  readonly replace: string;
}

export class StringReplace extends Construct implements IChainable, INextable {
  private readonly _chain: Chain;

  public readonly endStates: INextable[];
  public readonly id: string;
  public readonly startState: State;


  public constructor(scope: IConstruct, id: string, props: StringReplaceProps) {
    super(scope, id);

    this.id = id;

    const initialize = new Pass(this, `${id}-initialize`, {
      parameters: {
        'Builder': {
          [props.outputKey]: '',
        },
        'List.$': SfnFn.stringSplit(
          props.inputString,
          props.search,
        ),
        'Delimiter': '',
        'Index': 0,
        'Input.$': '$',
        'Join': props.replace,
        'Length.$': SfnFn.arrayLength(
          SfnFn.stringSplit(
            props.inputString,
            props.search,
          ),
        ),
      },
    });

    const iterate = new Choice(this, `${id}-iterate`);

    const build = new Pass(this, `${id}-build`, {
      parameters: {
        'Builder': {
          [`${props.outputKey}.$`]: SfnFn.format('{}{}{}', [
            `$.Builder.${props.outputKey}`,
            '$.Delimiter',
            SfnFn.arrayGetItem(
              '$.List',
              '$.Index',
            ),
          ]),
        },
        'Delimiter.$': '$.Join',
        'Index.$': SfnFn.mathAdd(
          '$.Index', 1,
        ),
        'Input.$': '$.Input',
        'Join.$': '$.Join',
        'Length.$': '$.Length',
        'List.$': '$.List',
      },
    });

    const cleanup = new Pass(this, `${id}-cleanup`, {
      parameters: {
        'Result.$': SfnFn.jsonMerge('$.Input', '$.Builder'),
      },
      outputPath: '$.Result',
    });

    this._chain = initialize
      .next(iterate
        .when(Condition.numberLessThanJsonPath(
          '$.Index',
          '$.Length',
        ), build
          .next(iterate))
        .afterwards({ includeOtherwise: true }))
      .next(cleanup);

    this.startState = initialize.startState;
    this.endStates = this._chain.endStates;
  }

  public next(state: IChainable): Chain {
    return this._chain.next(state);
  }
}
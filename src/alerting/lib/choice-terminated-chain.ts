import { Chain, Choice, IChainable, INextable, State } from 'aws-cdk-lib/aws-stepfunctions';


export class ChoiceTerminatedChain implements IChainable, INextable {
  private readonly choice: Choice;

  public readonly endStates: INextable[];
  public readonly id: string;
  public readonly startState: State;


  public constructor(chain: Chain, choice: Choice) {
    this.choice = choice;

    this.endStates = chain.endStates;
    this.id = chain.id;
    this.startState = chain.startState;
  }

  public next(state: IChainable): Chain {
    this.choice.otherwise(state);
    return this.choice.afterwards();
  }
}
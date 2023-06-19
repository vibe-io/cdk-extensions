import { Annotations } from 'aws-cdk-lib';
import { Chain, Choice, Condition, IChainable, Pass, Map } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct, IConstruct } from 'constructs';
import { SfnFn, StepFunctionValidation } from '../../stepfunctions';


export class AppendDelimiter {
  public static readonly NEWLINE: AppendDelimiter = AppendDelimiter.of('\n');
  public static readonly PARAGRAPH: AppendDelimiter = AppendDelimiter.of('\n\n');

  public static of(delimiter: string): AppendDelimiter {
    return new AppendDelimiter(delimiter);
  }


  public readonly delimiter: string;

  private constructor(delimiter: string) {
    this.delimiter = delimiter;
  }
}

export interface DescriptionBuilderProps {
  readonly initialDescription?: string;
}

export interface DescriptionBuilderIteratorProps {
  readonly arrayRef: string;
  readonly fieldDelimiter?: AppendDelimiter;
  readonly recordDelimiter?: AppendDelimiter;
  readonly resultPath: string;
  readonly sectionDelimiter?: AppendDelimiter;
  readonly title?: string;
}

export interface DescriptionBuilderSectionProps {
  readonly referenceChecks?: string[];
  readonly title: string;
}

export interface AddReferenceProps {
  readonly delimiter?: AppendDelimiter;
  readonly label?: string;
  readonly value: string;
  readonly required?: boolean;
}

export interface SetDelimiterProps {
  readonly delimiter: AppendDelimiter;
}

export interface WriteProps {
  readonly defaultDelimiter?: AppendDelimiter;
  readonly delimiter?: AppendDelimiter;
  readonly prefix?: string;
  readonly value: string;
  readonly required?: boolean;
  readonly suffix?: string;
}

export interface IDelayedChainable {
  render(): IChainable;
}

class DelayedChainable {
  public static fromChainable(chainable: IChainable): IDelayedChainable {
    return {
      render: () => {
        return chainable;
      },
    };
  }
}

export interface IDescriptionBuilderComponent extends IDelayedChainable {
  get classifier(): string;

  addIterator(id: string, props: DescriptionBuilderIteratorProps): DescriptionBuilderIterator;
  addReference(id: string, props: AddReferenceProps): IChainable;
  setDelimiter(id: string, props: SetDelimiterProps): IChainable;
  write(id: string, props: WriteProps): IChainable;
}

abstract class DescriptionBuilderBase extends Construct implements IDescriptionBuilderComponent, IDelayedChainable {
  private readonly _chain: IDelayedChainable[];

  public get classifier(): string {
    const components: string[] = [];
    let node: IConstruct | undefined = this;

    while (node && !(node instanceof DescriptionBuilder)) {
      components.push(node.node.id);
      node = node.node.scope;
    }

    return components.reverse().join('-');
  }


  public constructor(scope: IConstruct, id: string) {
    super(scope, id);

    this._chain = [];
  }

  public addIterator(id: string, props: DescriptionBuilderIteratorProps): DescriptionBuilderIterator {
    const iterator = new DescriptionBuilderIterator(this, id, props);
    this.registerBuilder(iterator);
    return iterator;
  }

  public addReference(id: string, props: AddReferenceProps): IChainable {
    return this.write(id, {
      ...props,
      prefix: props.label ? `${props.label}: ` : '',
    });
  }

  protected buildId(prefix: string, id?: string): string {
    const components = [
      prefix,
      this.classifier,
      id,
    ];

    return components.filter((x) => {
      return x && x != '';
    }).join('-');
  }

  private resolveRequired(value: string, requested?: boolean): boolean {
    if (StepFunctionValidation.isJsonPath(value)) {
      return requested ?? false;
    } else if (requested === false) {
      Annotations.of(this).addWarning([
        `Non-JSONPath  input '${value}' specified as optional. Only JSONPath`,
        'expressions can be marked as optional.',
      ].join(' '));
    }

    return true;
  }

  public setDelimiter(id: string, props: SetDelimiterProps): IChainable {
    const state = new Pass(this, this.buildId('config', id), {
      parameters: {
        'Builder.$': '$.Description.Builder',
        'Delimiter': props.delimiter.delimiter,
      },
      resultPath: '$.Description',
    });

    return this.registerChainable(state);
  }

  public write(id: string, props: WriteProps): IChainable {
    const value = props.value;
    const expr = StepFunctionValidation.isStatesExpression(value);
    const delimiter = props.delimiter?.delimiter ?? '{}';
    const templateValue = expr ? '{}' : value;
    const required = this.resolveRequired(value, props.required);
    const prefix = props.prefix ? `${props.prefix}` : '';
    const suffix = props.suffix ? `${props.suffix}` : '';
    const template = `{}${delimiter}${prefix}${templateValue}${suffix}`;

    const defaultDelimiter = props.defaultDelimiter ? {
      Delimiter: props.defaultDelimiter.delimiter,
    } : {
      'Delimiter.$': '$.Description.Delimiter',
    };

    const args = ['$.Description.Builder'];
    if (!props.delimiter) {args.push('$.Description.Delimiter');}
    if (expr) {args.push(value);}

    const addField = new Pass(this, this.buildId('add', id), {
      parameters: {
        'Builder.$': SfnFn.format(template, args),
        ...defaultDelimiter,
      },
      resultPath: '$.Description',
    });

    if (required) {
      return this.registerChainable(addField);
    } else {
      const choice = new Choice(this, this.buildId('check', id));
      const chain = choice
        .when(Condition.isPresent(value), addField)
        .afterwards({ includeOtherwise: true });

      return this.registerChainable(chain);
    }
  }

  protected registerBuilder(builder: IDescriptionBuilderComponent): IDescriptionBuilderComponent {
    this._chain.push(builder);
    return builder;
  }

  protected registerChainable(chainable: IChainable): IChainable {
    this._chain.push(DelayedChainable.fromChainable(chainable));
    return chainable;
  }

  public render(): IChainable {
    const rendered = this._chain.map((x) => {
      return x.render();
    });

    if (rendered.length === 0) {
      throw new Error([
        'At least one chainable state must be added to a description builder',
        'node.',
      ].join(' '));
    } else if (rendered.length === 1) {
      return rendered[0];
    } else {
      const start = Chain.start(rendered[0]);

      return rendered.splice(1).reduce((prev: Chain, cur: IChainable) => {
        return prev.next(cur);
      }, start).next(new Pass(this, this.buildId('end')));
    }
  }
}

export class DescriptionBuilderIterator extends DescriptionBuilderBase {
  public readonly arrayRef: string;
  public readonly fieldDelimiter: AppendDelimiter;
  public readonly recordDelimiter: AppendDelimiter;
  public readonly resultPath: string;
  public readonly sectionDelimiter: AppendDelimiter;
  public readonly title?: string;


  public constructor(scope: IConstruct, id: string, props: DescriptionBuilderIteratorProps) {
    super(scope, id);

    this.arrayRef = props.arrayRef;
    this.fieldDelimiter = props.fieldDelimiter ?? AppendDelimiter.NEWLINE;
    this.recordDelimiter = props.recordDelimiter ?? AppendDelimiter.PARAGRAPH;
    this.resultPath = props.resultPath;
    this.sectionDelimiter = props.sectionDelimiter ?? AppendDelimiter.PARAGRAPH;
    this.title = props.title;
  }

  public render(): IChainable {
    const map = new Map(this, this.buildId('map'), {
      itemsPath: this.arrayRef,
      parameters: {
        'Item.$': '$$.Map.Item.Value',
        'Description': {
          Builder: '',
          Delimiter: '',
        },
      },
      resultSelector: {
        'Result.$': "$[?(@.Description.Builder != '')].Description.Builder",
      },
      resultPath: this.resultPath,
    });

    const chain = super.render();

    const joinInitialize = new Pass(this, 'join-initialize', {
      parameters: {
        'Index': 0,
        'Delimiter': this.sectionDelimiter,
        'Length.$': SfnFn.arrayLength(`${this.resultPath}.Result`),
      },
      resultPath: '$.Iterator',
    });

    const checkResults = new Choice(this, 'check-results');

    const setSectionDelimiter = Chain.start(this.setDelimiter('start', {
      delimiter: this.sectionDelimiter,
    }));

    const addTitle = !this.title ? undefined : Chain.start(this.write(this.buildId('add', 'title'), {
      defaultDelimiter: AppendDelimiter.NEWLINE,
      suffix: ':',
      value: this.title,
    }));

    const joinIterator = new Choice(this, 'join-iterator');

    const write = Chain.start(this.write('join-iteration', {
      defaultDelimiter: AppendDelimiter.PARAGRAPH,
      value: SfnFn.arrayGetItem(
        `${this.resultPath}.Result`,
        '$.Iterator.Index',
      ),
    }));

    const step = new Pass(this, 'join-step', {
      parameters: {
        'Index.$': SfnFn.mathAdd('$.Iterator.Index', 1),
        'Length.$': '$.Iterator.Length',
      },
      resultPath: '$.Iterator',
    });

    const iterate = joinIterator
      .when(Condition.numberLessThanJsonPath(
        '$.Iterator.Index',
        '$.Iterator.Length',
      ), write
        .next(step))
      .afterwards({ includeOtherwise: true });

    const writeResults = !addTitle ? iterate : addTitle.next(iterate);

    return map
      .iterator(chain)
      .next(joinInitialize)
      .next(checkResults
        .when(Condition.numberGreaterThan('$.Iterator.Length', 0), setSectionDelimiter
          .next(writeResults))
        .afterwards({ includeOtherwise: true }));
  }

  public write(id: string, props: WriteProps): IChainable {
    return super.write(id, {
      ...props,
      defaultDelimiter: props.defaultDelimiter ?? this.fieldDelimiter,
    });
  }
}

export class DescriptionBuilderSection extends DescriptionBuilderBase {
  private readonly _refs: string[];

  public readonly title: string;

  public get refs(): string[] {
    return [...this._refs];
  }


  public constructor(scope: IConstruct, id: string, props: DescriptionBuilderSectionProps) {
    super(scope, id);

    this._refs = [];

    this.title = props.title;

    if (this.title) {
      this.write(this.buildId('add', 'title'), {
        delimiter: AppendDelimiter.PARAGRAPH,
        defaultDelimiter: AppendDelimiter.NEWLINE,
        suffix: ':',
        value: this.title,
      });
    }

    props.referenceChecks?.forEach((x) => {
      this.addReferenceCheck(x);
    });
  }

  public addReferenceCheck(ref: string): void {
    this._refs.push(ref);
  }

  public render(): IChainable {
    const chain = super.render();

    if (this._refs.length === 0) {
      return chain;
    }

    const choice = new Choice(this, this.buildId('check'));

    const fieldChecks = this._refs.map((x) => {
      return Condition.isPresent(x);
    });

    const condition = fieldChecks.length === 1 ?
      fieldChecks[0] :
      Condition.or(...fieldChecks);

    return choice
      .when(condition, chain)
      .afterwards({ includeOtherwise: true });
  }
}

export class DescriptionBuilder extends DescriptionBuilderBase {
  public readonly initialDescription: string;

  public readonly initializeNode: IChainable;


  public constructor(scope: IConstruct, props: DescriptionBuilderProps = {}) {
    super(scope, 'description-builder');

    this.initialDescription = props.initialDescription ?? '';

    this.initializeNode = this.initialize();
  }

  public addSection(id: string, props: DescriptionBuilderSectionProps): DescriptionBuilderSection {
    const section = new DescriptionBuilderSection(this, id, props);
    this.registerBuilder(section);
    return section;
  }

  protected initialize(): IChainable {
    const initialize = new Pass(this, 'initialize-description-builder', {
      parameters: {
        Builder: this.initialDescription,
        Delimiter: '\n',
      },
      resultPath: '$.Description',
    });

    return this.registerChainable(initialize);
  }
}
import { Resource, ResourceProps } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { CfnWorkflow } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';
import { ITriggerAction, ITriggerPredicate, PredicateOperator, Trigger, TriggerType } from './trigger';


export interface TriggerOptions extends ResourceProps {
    readonly actions?: ITriggerAction[];
    readonly description?: string;
    readonly name?: string;
    readonly predicateConditions?: ITriggerPredicate[];
    readonly predicateOperator?: PredicateOperator;
    readonly schedule?: Schedule;
    readonly startOnCreation?: boolean;
    readonly type: TriggerType;
}

/**
 * Configuration for the Glue Workflow resource.
 */
export interface WorkflowProps extends ResourceProps {
    readonly description?: string;
    readonly name?: string;
}

export class Workflow extends Resource {
    // Input properties
    public readonly description?: string;
    public readonly name?: string;

    // Resource properties
    public readonly resource: CfnWorkflow;

    // Standard properties
    public readonly workflowArn: string;
    public readonly workflowName: string;


    constructor(scope: Construct, id: string, props: WorkflowProps) {
        super(scope, id, props);

        this.description = props.description;
        this.name = props.name;

        this.resource = new CfnWorkflow(this, 'Resource', {
            description: this.description,
            name: this.name
        });

        this.workflowArn = this.stack.formatArn({
            resource: 'table',
            resourceName: this.resource.ref,
            service: 'glue'
        });
        this.workflowName = this.resource.ref;
    }

    public addTrigger(id: string, options: TriggerOptions): Trigger {
        return new Trigger(this, `trigger-${id}`, {
            ...options,
            workflow: this
        });
    }
}

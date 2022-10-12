import { Lazy, Resource, ResourceProps } from 'aws-cdk-lib';
import { CfnInstanceAccessControlAttributeConfiguration } from 'aws-cdk-lib/aws-sso';
import { Construct } from 'constructs';
import { IInstance } from './instance';
import { AccessControlAttribute } from './lib/access-control-attribute';


/**
 * Configuration for InstanceAccessControlAttributeConfiguration resource.
 */
export interface InstanceAccessControlAttributeConfigurationProps extends ResourceProps {
    /**
     * Lists the attributes that are configured for ABAC in the specified IAM
     * Identity Center instance.
     */
    readonly attributeMapping?: {[key: string]: string[]};

    /**
     * The ARN of the IAM Identity Center instance under which the operation
     * will be executed.
     */
    readonly instance: IInstance;
}

/**
 * Enables the attribute-based access control (ABAC) feature for the specified
 * IAM Identity Center instance. You can also specify new attributes to add to
 * your ABAC configuration during the enabling process. For more information
 * about ABAC, see [Attribute-Based Access Control](https://docs.aws.amazon.com/singlesignon/latest/userguide/abac.html) in the IAM Identity Center
 * User Guide.
 */
export class InstanceAccessControlAttributeConfiguration extends Resource {
    // Internal properties
    private readonly _attributes: AccessControlAttribute[] = [];

    // Input properties

    /**
     * The ARN of the IAM Identity Center instance under which the operation
     * will be executed.
     */
    public readonly instance: IInstance;

    // Resource properties

    /**
     * The underlying InstanceAccessControlAttributeConfiguration
     * CloudFormation resource.
     */
    public readonly resource: CfnInstanceAccessControlAttributeConfiguration;

    // Standard accessors

    /**
     * Lists the attributes that are configured for ABAC in the specified IAM
     * Identity Center instance. This array is readonly. Changes made to the
     * array will not be reflected in this resource. To add new attributes use
     * the `{@link addAttribute}` method.
     */
    public get attributes(): AccessControlAttribute[] {
        return [...this._attributes];
    }


    /**
     * Creates a new instance of the
     * InstanceAccessControlAttributeConfiguration class.
     * 
     * @param scope A CDK Construct that will serve as this stack's parent in
     * the construct tree.
     * @param id A name to be associated with the stack and used in resource
     * naming. Must be unique 
     * within the context of 'scope'.
     * @param props Arguments related to the configuration of the resource.
     */
    constructor(scope: Construct, id: string, props: InstanceAccessControlAttributeConfigurationProps) {
        super(scope, id, props);

        this.instance = props.instance;

        this.resource = new CfnInstanceAccessControlAttributeConfiguration(this, 'Resource', {
            instanceArn: this.instance.instanceArn,
            accessControlAttributes: Lazy.any(
                {
                    produce: () => {
                        this._attributes.map((x) => {
                            return x.bind(this);
                        });
                    }
                },
                {
                    omitEmptyArray: true
                }
            )
        });
    }

    /**
     * Adds a new ABAC attribute in the specified IAM Identity Center instance.
     * 
     * @param key The name of the attribute associated with your identities in
     * your identity source. This is used to map a specified attribute in your
     * identity source with an attribute in IAM Identity Center.
     * @param sources The identity sources to use when mapping a specified
     * attribute to IAM Identity Center.
     * @returns An AccessControlAttribute resource that will be applied to the
     * configuration and supports continued management.
     */
    public addAttribute(key: string, ...sources: string[]): AccessControlAttribute {
        const attribute = new AccessControlAttribute({
            name: key,
            sources: sources
        });

        this._attributes.push(attribute);
        return attribute;
    }
}
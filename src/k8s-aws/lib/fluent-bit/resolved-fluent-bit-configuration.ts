import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IFluentBitParserPlugin } from '.';


/**
 * The output of a Fluent Bit configuration object for consumption be the
 * resource configuring Fluent Bit.
 */
export interface ResolvedFluentBitConfiguration {
  /**
     * The configuration rended as a configuration file that can be read by the
     * Fluent Bit service.
     */
  readonly configFile: string;

  /**
   * A list of parsers referenced by this plugin.
   */
  readonly parsers?: IFluentBitParserPlugin[];

  /**
   * IAM permissions required by resources that will be using this plugin.
   */
  readonly permissions?: PolicyStatement[];
}
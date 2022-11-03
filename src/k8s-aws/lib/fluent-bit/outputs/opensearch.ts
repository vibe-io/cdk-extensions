import { Stack } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IDomain } from 'aws-cdk-lib/aws-opensearchservice';
import { IConstruct } from 'constructs';
import { DataSize } from '../../../../core';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { convertBool } from '../utils';
import { FluentBitOutputPlugin, FluentBitOutputPluginCommonOptions } from './output-plugin';


/**
 * Represents the size of the OpenSeach output buffer to be used by Fluent Bit.
 */
export class OpenSearchOutputBufferSize {
  /**
     * Set the output buffer size to unlimited.
     */
  public static UNLIMITED: OpenSearchOutputBufferSize = OpenSearchOutputBufferSize.of('False');

  /**
     * Set the output buffer to a specified data size.
     *
     * @param size The size of the output buffer.
     * @returns An output buffer size object representing the specified buffer
     * size.
     */
  public static bytes(size: DataSize): OpenSearchOutputBufferSize {
    return OpenSearchOutputBufferSize.of(size.toBytes().toString());
  }

  /**
     * An escape hatch that allows an arbitrary value to be set for the
     * OpenSearch buffer output property.
     *
     * @param value The value to use for the OpenSearch buffer output property.
     * @returns A `OpenSearchOutputBufferSize` object representing the passed
     * value.
     */
  public static of(value: string): OpenSearchOutputBufferSize {
    return new OpenSearchOutputBufferSize(value);
  }


  /**
     * The value to use for the OpenSearch buffer output property.
     */
  public readonly value: string;

  /**
     *
     * @param value The value to use for the OpenSearch buffer output property.
     */
  private constructor(value: string) {
    this.value = value;
  }
}


/**
 * Options for configuring the OpenSearch Fluent Bit output plugin.
 *
 * @see [OpenSearch Plugin Documention](https://docs.fluentbit.io/manual/pipeline/outputs/opensearch)
 */
export interface FluentBitOpenSearchOutputOptions extends FluentBitOutputPluginCommonOptions {
  /**
     * Enable AWS Sigv4 Authentication for Amazon OpenSearch Service.
     *
     * @default false
     */
  readonly awsAuth?: boolean;

  /**
     * External ID for the AWS IAM Role specified with `awsRole`.
     */
  readonly awsExternalId?: string;

  /**
     * Specify the AWS region for Amazon OpenSearch Service.
     */
  readonly awsRegion?: string;

  /**
     * AWS IAM Role to assume to put records to your Amazon cluster.
     */
  readonly awsRole?: IRole;

  /**
     * Specify the custom sts endpoint to be used with STS API for Amazon
     * OpenSearch Service.
     */
  readonly awsStsEndpoint?: string;

  /**
     * Specify the buffer size used to read the response from the OpenSearch
     * HTTP service. This option is useful for debugging purposes where is
     * required to read full responses, note that response size grows depending
     * of the number of records inserted.
     */
  readonly bufferSize?: OpenSearchOutputBufferSize;

  /**
     * Use current time for index generation instead of message record.
     *
     * @default false
     */
  readonly currentTimeIndex?: boolean;

  /**
     * The Opensearch domain to which logs should be shipped.
     */
  readonly domain: IDomain;

  /**
     * When enabled, generate `_id` for outgoing records. This prevents duplicate
     * records when retrying.
     */
  readonly generateId?: boolean;

  /**
     * IP address or hostname of the target OpenSearch instance.
     */
  readonly host?: string;

  /**
     * Password for user defined in `httpUser`.
     */
  readonly httpPasswd?: string;

  /**
     * Optional username credential for access.
     */
  readonly httpUser?: string;

  /**
     * If set, `_id` will be the value of the key from incoming record and
     * `generateId` option is ignored.
     */
  readonly idKey?: string;

  /**
     * When enabled, it append the Tag name to the record.
     */
  readonly includeTagKey?: boolean;

  /**
     * Index name.
     *
     * @default 'fluent-bit
     */
  readonly index?: string;

  /**
     * Time format (based on strftime) to generate the second part of the Index
     * name.
     *
     * @default '%Y.%m.%d'
     *
     * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
     */
  readonly logstashDateFormat?: string;

  /**
     * Enable Logstash format compatibility.
     *
     * @default false
     */
  readonly logstashFormat?: boolean;

  /**
     * When `logstashFormat` is enabled, the Index name is composed using a
     * prefix and the date, e.g: If `logstashPrefix` is equals to 'mydata' your
     * index will become 'mydata-YYYY.MM.DD'.
     *
     * The last string appended belongs to the date when the data is being
     * generated.
     *
     * @default 'logstash'
     */
  readonly logstashPrefix?: string;

  /**
     * When included: the value in the record that belongs to the key will be
     * looked up and over-write the `logstashPrefix` for index generation. If
     * the key/value is not found in the record then the `logstashPrefix` option
     * will act as a fallback.
     *
     * Nested keys are not supported (if desired, you can use the nest filter
     * plugin to remove nesting)
     */
  readonly logstashPrefixKey?: string;

  /**
     * OpenSearch accepts new data on HTTP query path "/_bulk". But it is also
     * possible to serve OpenSearch behind a reverse proxy on a subpath. This
     * option defines such path on the fluent-bit side. It simply adds a path
     * prefix in the indexing HTTP POST URI..
     */
  readonly path?: string;

  /**
     * OpenSearch allows to setup filters called pipelines. This option allows
     * to define which pipeline the database should use.
     */
  readonly pipeline?: string;

  /**
     * TCP port of the target OpenSearch instance.
     *
     * @default 9200
     */
  readonly port?: number;

  /**
     * When enabled, replace field name dots with underscore.
     *
     * @default false
     */
  readonly replaceDots?: boolean;

  /**
     * When enabled, mapping types is removed and `type` option is ignored.
     *
     * @default false
     */
  readonly suppressTypeName?: boolean;

  /**
     * When `includeTagKey` is enabled, this property defines the key name for
     * the tag.
     *
     * @default '_flb-key'
     */
  readonly tagKey?: string;

  /**
     * When `logstashFormat` is enabled, each record will get a new timestamp
     * field. The`timeKey` property defines the name of that field.
     *
     * @default '@timestamp'
     */
  readonly timeKey?: string;

  /**
     * When `logstashFormat` is enabled, this property defines the format of the
     * timestamp.
     *
     * @default '%Y-%m-%dT%H:%M:%S'
     *
     * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
     */
  readonly timeKeyFormat?: string;

  /**
     * When `logstashFormat` is enabled, enabling this property sends nanosecond
     * precision timestamps.
     *
     * @default false
     */
  readonly timeKeyNanos?: boolean;

  /**
     * When enabled print the OpenSearch API calls to stdout when OpenSearch
     * returns an error (for diag only).
     *
     * @default false
     */
  readonly traceError?: boolean;

  /**
     * When enabled print the OpenSearch API calls to stdout (for diag only).
     *
     * @default false
     */
  readonly traceOutput?: boolean;

  /**
     * Type name.
     *
     * @default '_doc'
     */
  readonly type?: string;

  /**
     * Enables dedicated thread(s) for this output.
     *
     * @default 2
     */
  readonly workers?: number;

  /**
     * Operation to use to write in bulk requests.
     *
     * @default 'create'
     */
  readonly writeOperation?: string;
}

export class FluentBitOpenSearchOutput extends FluentBitOutputPlugin {
  /**
     * Enable AWS Sigv4 Authentication for Amazon OpenSearch Service.
     *
     * @group Inputs
     */
  readonly awsAuth?: boolean;

  /**
     * External ID for the AWS IAM Role specified with `awsRole`.
     *
     * @group Inputs
     */
  readonly awsExternalId?: string;

  /**
     * Specify the AWS region for Amazon OpenSearch Service.
     *
     * @group Inputs
     */
  readonly awsRegion?: string;

  /**
     * AWS IAM Role to assume to put records to your Amazon cluster.
     *
     * @group Inputs
     */
  readonly awsRole?: IRole;

  /**
     * Specify the custom sts endpoint to be used with STS API for Amazon
     * OpenSearch Service.
     *
     * @group Inputs
     */
  readonly awsStsEndpoint?: string;

  /**
     * Specify the buffer size used to read the response from the OpenSearch
     * HTTP service. This option is useful for debugging purposes where is
     * required to read full responses, note that response size grows depending
     * of the number of records inserted.
     *
     * @group Inputs
     */
  readonly bufferSize?: OpenSearchOutputBufferSize;

  /**
     * Use current time for index generation instead of message record.
     *
     * @group Inputs
     */
  readonly currentTimeIndex?: boolean;

  /**
     * The Opensearch domain to which logs should be shipped.
     *
     * @group Inputs
     */
  readonly domain: IDomain;

  /**
     * When enabled, generate `_id` for outgoing records. This prevents duplicate
     * records when retrying.
     *
     * @group Inputs
     */
  readonly generateId?: boolean;

  /**
     * Password for user defined in `httpUser`.
     *
     * @group Inputs
     */
  readonly httpPasswd?: string;

  /**
     * Optional username credential for access.
     *
     * @group Inputs
     */
  readonly httpUser?: string;

  /**
     * If set, `_id` will be the value of the key from incoming record and
     * `generateId` option is ignored.
     *
     * @group Inputs
     */
  readonly idKey?: string;

  /**
     * When enabled, it append the Tag name to the record.
     *
     * @group Inputs
     */
  readonly includeTagKey?: boolean;

  /**
     * Index name.
     *
     * @group Inputs
     */
  readonly index?: string;

  /**
     * Time format (based on strftime) to generate the second part of the Index
     * name.
     *
     * @group Inputs
     *
     * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
     */
  readonly logstashDateFormat?: string;

  /**
     * Enable Logstash format compatibility.
     *
     * @group Inputs
     */
  readonly logstashFormat?: boolean;

  /**
     * When `logstashFormat` is enabled, the Index name is composed using a
     * prefix and the date, e.g: If `logstashPrefix` is equals to 'mydata' your
     * index will become 'mydata-YYYY.MM.DD'.
     *
     * The last string appended belongs to the date when the data is being
     * generated.
     *
     * @group Inputs
     */
  readonly logstashPrefix?: string;

  /**
     * When included: the value in the record that belongs to the key will be
     * looked up and over-write the `logstashPrefix` for index generation. If
     * the key/value is not found in the record then the `logstashPrefix` option
     * will act as a fallback.
     *
     * Nested keys are not supported (if desired, you can use the nest filter
     * plugin to remove nesting).
     *
     * @group Inputs
     */
  readonly logstashPrefixKey?: string;

  /**
     * OpenSearch accepts new data on HTTP query path "/_bulk". But it is also
     * possible to serve OpenSearch behind a reverse proxy on a subpath. This
     * option defines such path on the fluent-bit side. It simply adds a path
     * prefix in the indexing HTTP POST URI.
     *
     * @group Inputs
     */
  readonly path?: string;

  /**
     * OpenSearch allows to setup filters called pipelines. This option allows
     * to define which pipeline the database should use.
     *
     * @group Inputs
     */
  readonly pipeline?: string;

  /**
     * TCP port of the target OpenSearch instance.
     *
     * @group Inputs
     */
  readonly port: number;

  /**
     * When enabled, replace field name dots with underscore.
     *
     * @group Inputs
     */
  readonly replaceDots?: boolean;

  /**
     * When enabled, mapping types is removed and `type` option is ignored.
     *
     * @group Inputs
     */
  readonly suppressTypeName?: boolean;

  /**
     * When `includeTagKey` is enabled, this property defines the key name for
     * the tag.
     *
     * @group Inputs
     */
  readonly tagKey?: string;

  /**
     * When `logstashFormat` is enabled, each record will get a new timestamp
     * field. The`timeKey` property defines the name of that field.
     *
     * @group Inputs
     */
  readonly timeKey?: string;

  /**
     * When `logstashFormat` is enabled, this property defines the format of the
     * timestamp.
     *
     * @group Inputs
     *
     * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
     */
  readonly timeKeyFormat?: string;

  /**
     * When `logstashFormat` is enabled, enabling this property sends nanosecond
     * precision timestamps.
     *
     * @group Inputs
     */
  readonly timeKeyNanos?: boolean;

  /**
     * When enabled print the OpenSearch API calls to stdout when OpenSearch
     * returns an error (for diag only).
     *
     * @group Inputs
     */
  readonly traceError?: boolean;

  /**
     * When enabled print the OpenSearch API calls to stdout (for diag only).
     *
     * @group Inputs
     */
  readonly traceOutput?: boolean;

  /**
     * Type name.
     *
     * @group Inputs
     */
  readonly type?: string;

  /**
     * Enables dedicated thread(s) for this output.
     *
     * @group Inputs
     */
  readonly workers?: number;

  /**
     * Operation to use to write in bulk requests.
     *
     * @group Inputs
     */
  readonly writeOperation?: string;


  /**
    * Creates a new instance of the FluentBitOpenSearchOutput class.
    *
    * @param options Options for configuring the output.
    */
  public constructor(options: FluentBitOpenSearchOutputOptions) {
    super('opensearch', options);

    this.awsAuth = options.awsAuth;
    this.awsExternalId = options.awsExternalId;
    this.awsRegion = options.awsRegion;
    this.awsRole = options.awsRole;
    this.awsStsEndpoint = options.awsStsEndpoint;
    this.bufferSize = options.bufferSize;
    this.currentTimeIndex = options.currentTimeIndex;
    this.domain = options.domain;
    this.generateId = options.generateId;
    this.httpPasswd = options.httpPasswd;
    this.httpUser = options.httpUser;
    this.idKey = options.idKey;
    this.includeTagKey = options.includeTagKey;
    this.index = options.index;
    this.logstashDateFormat = options.logstashDateFormat;
    this.logstashFormat = options.logstashFormat;
    this.logstashPrefix = options.logstashPrefix;
    this.logstashPrefixKey = options.logstashPrefixKey;
    this.path = options.path;
    this.pipeline = options.pipeline;
    this.port = options.port ?? 9200;
    this.replaceDots = options.replaceDots;
    this.suppressTypeName = options.suppressTypeName;
    this.tagKey = options.tagKey;
    this.timeKey = options.timeKey;
    this.timeKeyFormat = options.timeKeyFormat;
    this.timeKeyNanos = options.timeKeyNanos;
    this.traceError = options.traceError;
    this.traceOutput = options.traceOutput;
    this.type = options.type;
    this.workers = options.workers;
    this.writeOperation = options.writeOperation;
  }

  /**
     * Builds a configuration for this plugin and returns the details for
     * consumtion by a resource that is configuring logging.
     *
     * @param _scope The construct configuring logging using Fluent Bit.
     * @returns A configuration for the plugin that con be used by the resource
     * configuring logging.
     */
  public bind(scope: IConstruct): ResolvedFluentBitConfiguration {
    return {
      configFile: super.renderConfigFile({
        AWS_Auth: convertBool(this.awsAuth),
        AWS_External_ID: this.awsExternalId,
        AWS_Region: this.awsRegion ?? Stack.of(scope).region,
        AWS_Role_ARN: this.awsRole?.roleArn,
        AWS_STS_Endpoint: this.awsStsEndpoint,
        Buffer_Size: this.bufferSize?.value,
        Current_Time_Index: convertBool(this.currentTimeIndex),
        Generate_ID: convertBool(this.generateId),
        Host: this.domain.domainEndpoint,
        HTTP_Passwd: this.httpPasswd,
        HTTP_User: this.httpUser,
        Id_Key: this.idKey,
        Include_Tag_Key: this.includeTagKey,
        Index: this.index,
        Logstash_DateFormat: this.logstashDateFormat,
        Logstash_Format: convertBool(this.logstashFormat),
        Logstash_Prefix: this.logstashPrefix,
        Logstash_Prefix_Key: this.logstashPrefixKey,
        Path: this.path,
        Pipeline: this.pipeline,
        Port: this.port,
        Replace_Dots: convertBool(this.replaceDots),
        Suppress_Type_Name: convertBool(this.suppressTypeName),
        Tag_Key: this.tagKey,
        Time_Key: this.timeKey,
        Time_Key_Format: this.timeKeyFormat,
        Time_Key_Nanos: convertBool(this.timeKeyNanos),
        Trace_Error: convertBool(this.traceError),
        Trace_Output: convertBool(this.traceOutput),
        Type: this.type,
        Workers: this.workers,
        Write_Operation: this.writeOperation,
      }),
    };
  }
}
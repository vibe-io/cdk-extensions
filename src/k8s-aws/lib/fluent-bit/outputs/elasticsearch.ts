import { IRole } from 'aws-cdk-lib/aws-iam';
import { IConstruct } from 'constructs';
import { DataSize } from '../../../../core';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
import { convertBool } from '../utils';
import { FluentBitOutputPluginBase, FluentBitOutputPluginCommonOptions } from './output-plugin-base';


export enum ElasticsearchCompressionFormat {
  /**
     * Gzip compression format.
     */
  GZIP = 'gzip',
}

/**
 * Represents the size of the Elasticsearch output buffer to be used by Fluent
 * Bit.
 */
export class ElasticsearchOutputBufferSize {
  /**
     * Set the output buffer size to unlimited.
     */
  public static readonly UNLIMITED: ElasticsearchOutputBufferSize = ElasticsearchOutputBufferSize.of('False');

  /**
     * Set the output buffer to a specified data size.
     *
     * @param size The size of the output buffer.
     * @returns An output buffer size object representing the specified buffer
     * size.
     */
  public static bytes(size: DataSize): ElasticsearchOutputBufferSize {
    return ElasticsearchOutputBufferSize.of(size.toBytes().toString());
  }

  /**
     * An escape hatch that allows an arbitrary value to be set for the
     * Elasticsearch buffer output property.
     *
     * @param value The value to use for the Elasticsearch buffer output
     * property.
     * @returns A `ElasticsearchOutputBufferSize` object representing the
     * passed value.
     */
  public static of(value: string): ElasticsearchOutputBufferSize {
    return new ElasticsearchOutputBufferSize(value);
  }


  /**
     * The value to use for the Elasticsearch buffer output property.
     */
  public readonly value: string;

  /**
     *
     * @param value The value to use for the Elasticsearch buffer output
     * property.
     */
  private constructor(value: string) {
    this.value = value;
  }
}

/**
 * Options for configuring the Elasticsearch Fluent Bit output plugin.
 *
 * @see [Opensearch Plugin Documention](https://docs.fluentbit.io/manual/pipeline/outputs/elasticsearch)
 */
export interface FluentBitElasticsearchOutputOptions extends FluentBitOutputPluginCommonOptions {
  /**
     * Enable AWS Sigv4 Authentication for Amazon Elasticsearch Service.
     *
     * @default false
     */
  readonly awsAuth?: boolean;

  /**
     * External ID for the AWS IAM Role specified with `awsRole`.
     */
  readonly awsExternalId?: string;

  /**
     * Specify the AWS region for Elasticsearch Service.
     */
  readonly awsRegion?: string;

  /**
     * AWS IAM Role to assume to put records to your Amazon cluster.
     */
  readonly awsRole?: IRole;

  /**
     * Specify the custom sts endpoint to be used with STS API for Amazon
     * Elasticsearch Service.
     */
  readonly awsStsEndpoint?: string;

  /**
     * Specify the buffer size used to read the response from the Elasticsearch
     * HTTP service. This option is useful for debugging purposes where is
     * required to read full responses, note that response size grows depending
     * of the number of records inserted.
     */
  readonly bufferSize?: ElasticsearchOutputBufferSize;

  /**
     * Specify the credentials to use to connect to Elastic's Elasticsearch
     * Service running on Elastic Cloud
     */
  readonly cloudAuth?: string;

  /**
     * If you are using Elastic's Elasticsearch Service you can specify the
     * cloud_id of the cluster running.
     */
  readonly cloudId?: string;

  /**
     * Set payload compression mechanism.
     */
  readonly compress?: ElasticsearchCompressionFormat;

  /**
     * Use current time for index generation instead of message record.
     *
     * @default false
     */
  readonly currentTimeIndex?: boolean;

  /**
     * When enabled, generate `_id` for outgoing records. This prevents duplicate
     * records when retrying.
     */
  readonly generateId?: boolean;

  /**
     * IP address or hostname of the target Elasticsearch instance.
     */
  readonly host: string;

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
      * Elasticsearch accepts new data on HTTP query path "/_bulk". But it is
      * also possible to serve Elasticsearch behind a reverse proxy on a
      * subpath. This option defines such path on the fluent-bit side. It
      * simply adds a path prefix in the indexing HTTP POST URI..
      */
  readonly path?: string;

  /**
     * Elasticsearch allows to setup filters called pipelines. This option
     * allows to define which pipeline the database should use.
     */
  readonly pipeline?: string;

  /**
      * TCP port of the target Elasticsearch instance.
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
     * When enabled print the Elasticsearch API calls to stdout when
     * Elasticsearch returns an error (for diag only).
     *
     * @default false
     */
  readonly traceError?: boolean;

  /**
     * When enabled print the Elasticsearch API calls to stdout (for diag
     * only).
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

export class FluentBitElasticsearchOutput extends FluentBitOutputPluginBase {
  /**
     * Enable AWS Sigv4 Authentication for Amazon Elasticsearch Service.
     *
     * @group Inputs
     */
  public readonly awsAuth?: boolean;

  /**
     * External ID for the AWS IAM Role specified with `awsRole`.
     *
     * @group Inputs
     */
  public readonly awsExternalId?: string;

  /**
     * Specify the AWS region for Elasticsearch Service.
     *
     * @group Inputs
     */
  public readonly awsRegion?: string;

  /**
     * AWS IAM Role to assume to put records to your Amazon cluster.
     *
     * @group Inputs
     */
  public readonly awsRole?: IRole;

  /**
     * Specify the custom sts endpoint to be used with STS API for Amazon
     * Elasticsearch Service.
     *
     * @group Inputs
     */
  public readonly awsStsEndpoint?: string;

  /**
     * Specify the buffer size used to read the response from the Elasticsearch
     * HTTP service. This option is useful for debugging purposes where is
     * required to read full responses, note that response size grows depending
     * of the number of records inserted.
     *
     * @group Inputs
     */
  public readonly bufferSize?: ElasticsearchOutputBufferSize;

  /**
     * Specify the credentials to use to connect to Elastic's Elasticsearch
     * Service running on Elastic Cloud.
     *
     * @group Inputs
     */
  public readonly cloudAuth?: string;

  /**
     * If you are using Elastic's Elasticsearch Service you can specify the
     * cloud_id of the cluster running.
     *
     * @group Inputs
     */
  public readonly cloudId?: string;

  /**
     * Set payload compression mechanism.
     *
     * @group Inputs
     */
  public readonly compress?: ElasticsearchCompressionFormat;

  /**
     * Use current time for index generation instead of message record.
     *
     * @group Inputs
     */
  public readonly currentTimeIndex?: boolean;

  /**
     * When enabled, generate `_id` for outgoing records. This prevents duplicate
     * records when retrying.
     *
     * @group Inputs
     */
  public readonly generateId?: boolean;

  /**
     * IP address or hostname of the target Elasticsearch instance.
     *
     * @group Inputs
     */
  public readonly host: string;

  /**
     * Password for user defined in `httpUser`.
     *
     * @group Inputs
     */
  public readonly httpPasswd?: string;

  /**
     * Optional username credential for access.
     *
     * @group Inputs
     */
  public readonly httpUser?: string;

  /**
     * If set, `_id` will be the value of the key from incoming record and
     * `generateId` option is ignored.
     *
     * @group Inputs
     */
  public readonly idKey?: string;

  /**
     * When enabled, it append the Tag name to the record.
     *
     * @group Inputs
     */
  public readonly includeTagKey?: boolean;

  /**
     * Index name.
     *
     * @group Inputs
     */
  public readonly index?: string;

  /**
     * Time format (based on strftime) to generate the second part of the Index
     * name.
     *
     * @group Inputs
     *
     * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
     */
  public readonly logstashDateFormat?: string;

  /**
     * Enable Logstash format compatibility.
     *
     * @group Inputs
     */
  public readonly logstashFormat?: boolean;

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
  public readonly logstashPrefix?: string;

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
  public readonly logstashPrefixKey?: string;

  /**
      * Elasticsearch accepts new data on HTTP query path "/_bulk". But it is
      * also possible to serve Elasticsearch behind a reverse proxy on a
      * subpath. This option defines such path on the fluent-bit side. It
      * simply adds a path prefix in the indexing HTTP POST URI.
     *
     * @group Inputs
      */
  public readonly path?: string;

  /**
     * Elasticsearch allows to setup filters called pipelines. This option
     * allows to define which pipeline the database should use.
     *
     * @group Inputs
     */
  public readonly pipeline?: string;

  /**
      * TCP port of the target Elasticsearch instance.
     *
     * @group Inputs
      */
  public readonly port?: number;

  /**
     * When enabled, replace field name dots with underscore.
     *
     * @group Inputs
     */
  public readonly replaceDots?: boolean;

  /**
     * When enabled, mapping types is removed and `type` option is ignored.
     *
     * @group Inputs
     */
  public readonly suppressTypeName?: boolean;

  /**
     * When `includeTagKey` is enabled, this property defines the key name for
     * the tag.
     *
     * @group Inputs
     */
  public readonly tagKey?: string;

  /**
     * When `logstashFormat` is enabled, each record will get a new timestamp
     * field. The`timeKey` property defines the name of that field.
     *
     * @group Inputs
     */
  public readonly timeKey?: string;

  /**
     * When `logstashFormat` is enabled, this property defines the format of the
     * timestamp.
     *
     * @group Inputs
     *
     * @see [strftime](http://man7.org/linux/man-pages/man3/strftime.3.html)
     */
  public readonly timeKeyFormat?: string;

  /**
     * When `logstashFormat` is enabled, enabling this property sends nanosecond
     * precision timestamps.
     *
     * @group Inputs
     */
  public readonly timeKeyNanos?: boolean;

  /**
     * When enabled print the Elasticsearch API calls to stdout when
     * Elasticsearch returns an error (for diag only).
     *
     * @group Inputs
     */
  public readonly traceError?: boolean;

  /**
     * When enabled print the Elasticsearch API calls to stdout (for diag
     * only).
     *
     * @group Inputs
     */
  public readonly traceOutput?: boolean;

  /**
     * Type name.
     *
     * @group Inputs
     */
  public readonly type?: string;

  /**
     * Enables dedicated thread(s) for this output.
     *
     * @group Inputs
     */
  public readonly workers?: number;

  /**
     * Operation to use to write in bulk requests.
     *
     * @group Inputs
     */
  public readonly writeOperation?: string;


  /**
    * Creates a new instance of the FluentBitKinesisFirehoseOutput class.
    *
    * @param options Options for configuring the output.
    */
  public constructor(options: FluentBitElasticsearchOutputOptions) {
    super('es', options);

    this.awsAuth = options.awsAuth;
    this.awsExternalId = options.awsExternalId;
    this.awsRegion = options.awsRegion;
    this.awsRole = options.awsRole;
    this.awsStsEndpoint = options.awsStsEndpoint;
    this.bufferSize = options.bufferSize;
    this.cloudAuth = options.cloudAuth;
    this.cloudId = options.cloudId;
    this.compress = options.compress;
    this.currentTimeIndex = options.currentTimeIndex;
    this.generateId = options.generateId;
    this.host = options.host;
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
  public bind(_scope: IConstruct): ResolvedFluentBitConfiguration {
    return {
      configFile: super.renderConfigFile({
        AWS_Auth: convertBool(this.awsAuth),
        AWS_External_ID: this.awsExternalId,
        AWS_Region: this.awsRegion,
        AWS_Role_ARN: this.awsRole?.roleArn,
        AWS_STS_Endpoint: this.awsStsEndpoint,
        Buffer_Size: this.bufferSize?.value,
        compress: this.compress,
        Cloud_Auth: this.cloudAuth,
        Cloud_ID: this.cloudId,
        Current_Time_Index: convertBool(this.currentTimeIndex),
        Generate_ID: this.generateId,
        Host: this.host,
        HTTP_Passwd: this.httpPasswd,
        HTTP_User: this.httpUser,
        Id_Key: this.idKey,
        Include_Tag_Key: convertBool(this.includeTagKey),
        Index: this.index,
        Logstash_DateFormat: this.logstashDateFormat,
        Logstash_Format: convertBool( this.logstashFormat),
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
        Trace_Error: convertBool(this.traceOutput),
        Trace_Output: convertBool(this.traceOutput),
        Type: this.type,
        Workers: this.workers,
        Write_Operation: this.writeOperation,
      }),
    };
  }
}
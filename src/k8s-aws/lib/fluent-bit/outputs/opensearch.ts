import { IRole } from 'aws-cdk-lib/aws-iam';
import { IConstruct } from 'constructs';
import { DataSize } from '../../../../core';
import { ResolvedFluentBitConfiguration } from '../resolved-fluent-bit-configuration';
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
  public constructor(options: FluentBitOpenSearchOutputOptions = {}) {
    super('opensearch', options);

    if (options.awsAuth !== undefined) {
      this.addField('AWS_Auth', options.awsAuth ? 'On' : 'Off');
    }

    if (options.awsExternalId !== undefined) {
      this.addField('AWS_External_ID', options.awsExternalId);
    }

    if (options.awsRegion !== undefined) {
      this.addField('AWS_Region', options.awsRegion);
    }

    if (options.awsRole !== undefined) {
      this.addField('AWS_Role_ARN', options.awsRole.roleArn);
    }

    if (options.awsStsEndpoint !== undefined) {
      this.addField('AWS_STS_Endpoint', options.awsStsEndpoint);
    }

    if (options.bufferSize !== undefined) {
      this.addField('Buffer_Size', options.bufferSize.value);
    }

    if (options.currentTimeIndex !== undefined) {
      this.addField('Current_Time_Index', options.currentTimeIndex ? 'On' : 'Off');
    }

    if (options.generateId !== undefined) {
      this.addField('Generate_ID', options.generateId ? 'On' : 'Off');
    }

    if (options.host !== undefined) {
      this.addField('Host', options.host);
    }

    if (options.httpPasswd !== undefined) {
      this.addField('HTTP_Passwd', options.httpPasswd);
    }

    if (options.httpUser !== undefined) {
      this.addField('HTTP_User', options.httpUser);
    }

    if (options.idKey !== undefined) {
      this.addField('Id_Key', options.idKey);
    }

    if (options.includeTagKey !== undefined) {
      this.addField('Include_Tag_Key', options.includeTagKey ? 'On' : 'Off');
    }

    if (options.index !== undefined) {
      this.addField('Index', options.index);
    }

    if (options.logstashDateFormat !== undefined) {
      this.addField('Logstash_DateFormat', options.logstashDateFormat);
    }

    if (options.logstashFormat !== undefined) {
      this.addField('Logstash_Format', options.logstashDateFormat ? 'On' : 'Off');
    }

    if (options.logstashPrefix !== undefined) {
      this.addField('Logstash_Prefix', options.logstashPrefix);
    }

    if (options.logstashPrefixKey !== undefined) {
      this.addField('Logstash_Prefix_Key', options.logstashPrefixKey);
    }

    if (options.path !== undefined) {
      this.addField('Path', options.path);
    }

    if (options.pipeline !== undefined) {
      this.addField('Pipeline', options.pipeline);
    }

    if (options.port !== undefined) {
      this.addField('Port', options.port.toString());
    }

    if (options.replaceDots !== undefined) {
      this.addField('Replace_Dots', options.replaceDots ? 'On' : 'Off');
    }

    if (options.suppressTypeName !== undefined) {
      this.addField('Suppress_Type_Name', options.suppressTypeName ? 'On' : 'Off');
    }

    if (options.tagKey !== undefined) {
      this.addField('Tag_Key', options.tagKey);
    }

    if (options.timeKey !== undefined) {
      this.addField('Time_Key', options.timeKey);
    }

    if (options.timeKeyFormat !== undefined) {
      this.addField('Time_Key_Format', options.timeKeyFormat);
    }

    if (options.timeKeyNanos !== undefined) {
      this.addField('Time_Key_Nanos', options.timeKeyNanos ? 'On':'Off');
    }

    if (options.traceError !== undefined) {
      this.addField('Trace_Error', options.traceError ? 'On':'Off');
    }

    if (options.traceOutput !== undefined) {
      this.addField('Trace_Output', options.traceOutput ? 'On':'Off');
    }

    if (options.type !== undefined) {
      this.addField('Type', options.type);
    }

    if (options.workers !== undefined) {
      this.addField('Workers', options.workers.toString());
    }

    if (options.writeOperation !== undefined) {
      this.addField('Write_Operation', options.writeOperation);
    }
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
    if (this.fields.Host === undefined) {
      throw new Error([
        "Fluent Bit OpenSearch output plugin is missing the 'Host'",
        'property. Please pass a host endpoint either using the',
        '`host` property when creating the output or by adding the',
        "'Host' property using `addField`.",
      ].join(' '));
    }

    return super.bind(scope);
  }
}
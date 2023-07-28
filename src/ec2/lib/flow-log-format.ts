import { Lazy, Token } from 'aws-cdk-lib';
import { FlowLogDataType, FlowLogField } from './flow-log-field';


export class FlowLogFormat {
  /**
       * The basic set of fields included in most flow logs. This is the default
       * format that is used when new flow logs are created without specifying a
       * custom format.
       */
  public static readonly V2: FlowLogFormat = new FlowLogFormat(
    FlowLogField.VERSION,
    FlowLogField.ACCOUNT_ID,
    FlowLogField.INTERFACE_ID,
    FlowLogField.SRCADDR,
    FlowLogField.DSTADDR,
    FlowLogField.SRCPORT,
    FlowLogField.DSTPORT,
    FlowLogField.PROTOCOL,
    FlowLogField.PACKETS,
    FlowLogField.BYTES,
    FlowLogField.START,
    FlowLogField.END,
    FlowLogField.ACTION,
    FlowLogField.LOG_STATUS,
  );

  /**
       * Includes all the fields available in V2. Adds fields to help identify
       * AWS resources associated with traffic as well as fields that give
       * greater visibility into protocol specific details.
       */
  public static readonly V3: FlowLogFormat = new FlowLogFormat(
    ...FlowLogFormat.V2.fields,
    FlowLogField.VPC_ID,
    FlowLogField.SUBNET_ID,
    FlowLogField.INSTANCE_ID,
    FlowLogField.TCP_FLAGS,
    FlowLogField.TYPE,
    FlowLogField.PKT_SRCADDR,
    FlowLogField.PKT_DSTADDR,
  );

  /**
       * Includes all the fields available in V3. Adds fields for identifying
       * the region and availabilty zone associated with flows, as well as
       * details related to extended zones such as Wavelength, Outputs, and
       * Local Zones.
       */
  public static readonly V4: FlowLogFormat = new FlowLogFormat(
    ...FlowLogFormat.V3.fields,
    FlowLogField.REGION,
    FlowLogField.AZ_ID,
    FlowLogField.SUBLOCATION_TYPE,
    FlowLogField.SUBLOCATION_ID,
  );

  /**
       * Includes all the fields available in V4. Adds fields to help identify
       * related AWS services and improve visibility into packet routing.
       */
  public static readonly V5: FlowLogFormat = new FlowLogFormat(
    ...FlowLogFormat.V4.fields,
    FlowLogField.PKT_SRC_AWS_SERVICE,
    FlowLogField.PKT_DST_AWS_SERVICE,
    FlowLogField.FLOW_DIRECTION,
    FlowLogField.TRAFFIC_PATH,
  );

  /**
     * Parses a flow log format template string to create a new FlowLogFormat
     * object.
     *
     * @param template A flow log template string to parse.
     * @returns A FlowLogFormat object representing the passed template.
     */
  public static fromTemplate(template: string): FlowLogFormat {
    if (Token.isUnresolved(template)) {
      throw Error([
        "Can't parse flow log templates containing unresolved tokens.",
      ].join(' '));
    }

    const fields = template.split(' ');
    return new FlowLogFormat(...fields.map((x) => {
      const match = x.match(/^\$\{([A-Za-z0-9_-]+)\}$/);
      if (match) {
        const fieldName = match[1];
        const field = FlowLogField.lookupField(fieldName);
        return field ?? new FlowLogField(fieldName, FlowLogDataType.STRING);
      } else {
        throw Error(`Invalid FlowLogField format: ${x}.`);
      }
    }));
  }


  /**
       * The fields that make up the flow log format, in the order that they
       * should appear in the log entries.
       */
  public readonly fields: FlowLogField[];

  /**
       * The rendered format string in the format expected by AWS when creating
       * a new Flow Log.
       */
  public readonly template: string;

  /**
       * Creates a new instance of the FlowLogFormat class.
       *
       * @param fields The fields that should be included in the flow log output.
       */
  constructor(...fields: FlowLogField[]) {
    this.fields = fields;

    this.template = Lazy.string({
      produce: () => {
        return this.fields.map((x) => {
          return `\${${x.name}}`;
        }).join(' ');
      },
    });
  }

  /**
       * Adds a new field to the flow log output. New fields are added at the
       * end of a log entry after all the other fields that came before it.
       *
       * @param field The field to add to the FlowLogFormat.
       */
  public addField(field: FlowLogField): void {
    this.fields.push(field);
  }
}
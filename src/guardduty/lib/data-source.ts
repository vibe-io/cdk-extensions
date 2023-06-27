import { CfnDetector } from "aws-cdk-lib/aws-guardduty";
import { IConstruct } from "constructs";


/**
 * Represents a data source that should be enabled on a detector.
 */
export interface IDataSource {
  /**
   * Associates the data source with a resource configuring a GuardDuty
   * detector.
   * 
   * @param scope The resource managing the detector being configured.
   */
  bind(scope: IConstruct): CfnDetector.CFNDataSourceConfigurationsProperty;
}

/**
 * Options for configuring Kubernetes as a data source for GuardDuty.
 */
export interface KubernetesOptions {
  /**
   * Controls whether EKS audit logs should be used as a data source for
   * GuardDuty.
   */
  readonly auditLogs?: boolean;
}

/**
 * Options for configuring data sources for GuardDuty malware protection.
 */
export interface MalwareProtectionOptions {
  /**
   * Controls whether EBS volumes should be scanned for malware by GuardDuty.
   */
  readonly ebsVolumes?: boolean;
}

/**
 * Options for configuring whether S3 data events should be used as a data
 * source for GuardDuty.
 */
export interface S3LogsOptions {
  /**
   * Controls whether S3 data events are enabled as a data source for
   * GuardDuty.
   */
  readonly enabled?: boolean;
}

/**
 * A data source that will be configured for a GuardDuty detector.
 */
export class DataSource {
  /**
   * Creates a data source configuration for processing Kubernetes (EKS)
   * events.
   * 
   * @param options Options for configuring Kubernetes as a data source for
   * GuardDuty.
   * @returns An object representing the configured data source.
   */
  public static kubernetes(options: KubernetesOptions = {}): IDataSource {
    return {
      bind: () => {
        return {
          kubernetes: {
            auditLogs: {
              enable: options.auditLogs ?? true,
            },
          },
        };
      },
    };
  }

  /**
   * Creates a data source configuration allowing GuardDuty top perform malware
   * scanning.
   * 
   * @param options Options for configuring data sources for GuardDuty malware
   * protection.
   * @returns An object representing the configured data source.
   */
  public static malwareProtection(options: MalwareProtectionOptions = {}): IDataSource {
    return {
      bind: () => {
        return {
          malwareProtection: {
            scanEc2InstanceWithFindings: {
              ebsVolumes: options.ebsVolumes ?? true,
            },
          },
        };
      },
    };
  }

  /**
   * Creates a data source configuration for analyzing S3 data events in
   * GuardDuty.
   * 
   * @param options Options for configuring whether S3 data events should be
   * used as a data source for GuardDuty.
   * @returns An object representing the configured data source.
   */
  public static s3Logs(options: S3LogsOptions = {}): IDataSource {
    return {
      bind: () => {
        return {
          s3Logs: {
            enable: options.enabled ?? true,
          },
        };
      },
    };
  }
}
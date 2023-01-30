import { AlertingRule, AlertingRuleProps } from './alerting-rule';
import { RecordingRule, RecordingRuleProps } from './recording-rule';


export class PrometheusRule {
  public static alertingRule(options: AlertingRuleProps): AlertingRule {
    return new AlertingRule(options);
  }

  public static recordingRule(options: RecordingRuleProps): RecordingRule {
    return new RecordingRule(options);
  }
}
import { ResourceProps } from "aws-cdk-lib";
import { ResourceManagerLogging } from "./logging";


export interface ResourceManagerBaseProps extends ResourceProps {
  readonly logging?: ResourceManagerLogging;
  readonly tracingEnabled?: boolean;
}
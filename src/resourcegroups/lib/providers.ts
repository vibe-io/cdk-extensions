import { CloudFormationStack, CloudFormationStackProps, IStackReference } from './cloudformation-stack';
import { TagFilter, TagFilterProps } from './tag-filter';


export class GroupConfiguration {
  public static cloudFormationStack(reference: IStackReference, props: CloudFormationStackProps = {}): CloudFormationStack {
    return new CloudFormationStack(reference, props);
  }

  public static tagFilter(props: TagFilterProps = {}): TagFilter {
    return new TagFilter(props);
  }
}
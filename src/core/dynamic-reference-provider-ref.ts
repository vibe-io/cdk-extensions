import { IResolvable } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


export interface IDynamicReferenceProvider {
  forAny(scope: IConstruct, value: IResolvable): IResolvable;
  forNumber(scope: IConstruct, value: number): number;
  forString(scope: IConstruct, value: string): string;
  forStringList(scope: IConstruct, value: string[]): string[];
}
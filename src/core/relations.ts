import { Stack } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


export enum ConstructRelation {
  LOCAL,
  CROSS_REGION,
  CROSS_ACCOUNT,
}

export function getRelation(consumer: IConstruct, producer: IConstruct): ConstructRelation {
  const consumerStack = Stack.of(consumer);
  const producerStack = Stack.of(producer);
  const consumerAccount = consumerStack.account;
  const consumerRegion = consumerStack.region;
  const producerAccount = producerStack.account;
  const producerRegion = producerStack.region;

  if (producerAccount === consumerAccount && producerRegion === consumerRegion) {
    return ConstructRelation.LOCAL;
  } else if (producerAccount === consumerAccount) {
    return ConstructRelation.CROSS_REGION;
  } else {
    return ConstructRelation.CROSS_ACCOUNT;
  }
}
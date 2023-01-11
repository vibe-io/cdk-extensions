import { Connections, IConnectable } from 'aws-cdk-lib/aws-ec2';

export const isArray = (val: unknown): val is any[] => {
  return Object.prototype.toString.call(val) === '[object Array]';
};

export const isConnectable = (obj: unknown): obj is IConnectable => {
  return (obj as any).connections instanceof Connections;
};
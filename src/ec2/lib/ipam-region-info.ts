import { Fact, RegionInfo } from 'aws-cdk-lib/region-info';


const defaultRegions = [
  'af-south-1',
  'ap-east-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'eu-central-1',
  'eu-north-1',
  'eu-north-1',
  'eu-south-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'me-south-1',
  'sa-east-1',
  'us-east-1',
  'us-east-2',
  'us-gov-east-1',
  'us-gov-west-1',
  'us-west-1',
  'us-west-2',
];

export const IPAM_ENABLED_FACT = 'IPAM_ENABLED';

RegionInfo.regions.forEach((x) => {
  Fact.register({
    name: IPAM_ENABLED_FACT,
    region: x.name,
    value: defaultRegions.includes(x.name) ? 'ENABLED' : 'DISABLED',
  }, true);
});

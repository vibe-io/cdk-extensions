import { EC2 } from '@aws-sdk/client-ec2';


const ec2 = new EC2({});

export const handler = async(event: any) => {
  const vpcId = event.ResourceProperties.VpcId;
  if (!vpcId) {
    throw new Error("'VpcId' is required.");
  }

  const associationId = event.ResourceProperties.AssociationId;
  if (!associationId) {
    throw new Error("'AssociationId' is required.");
  }

  const resp = await ec2.describeVpcs({
    VpcIds: [
      vpcId,
    ],
  });

  const vpcLength = resp.Vpcs?.length ?? 0;
  if (vpcLength !== 1) {
    throw new Error(`Expected 1 vpc result but got ${vpcLength}.`);
  } else {
    const vpc = resp.Vpcs![0];
    const associations = vpc.CidrBlockAssociationSet?.filter((x) => {
      return x.AssociationId === associationId;
    });

    const associationLength = associations?.length;
    if (associationLength !== 1) {
      throw new Error(`Expected 1 association result but got ${associationLength}.`);
    } else {
      return {
        Data: {
          CidrBlock: associations![0].CidrBlock,
        },
        PhysicalResourceId: `${vpcId}|${associationId}`,
      };
    }
  }
};

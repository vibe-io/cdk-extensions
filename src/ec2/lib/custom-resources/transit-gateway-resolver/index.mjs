import { EC2 } from '@aws-sdk/client-ec2';


const ec2 = new EC2({});

export const onEventHandler = async(event) => {
  const transitGatewayId = event.ResourceProperties['TransitGatewayId'];
  if (!transitGatewayId) {
    throw new Error("'TransitGatewayId' is required.");
  }

  const resp = await ec2.describeTransitGateways({
    TransitGatewayIds: [
        transitGatewayId,
    ]
  });

  const tgws = resp.TransitGateways;
  if (tgws && tgws.length === 1) {
    const tgw = tgws[0];
    return {
      Data: {
        DefaultAssociationRouteTableId: tgw.Options?.AssociationDefaultRouteTableId,
        DefaultPropagationRouteTableId: tgw.Options?.PropagationDefaultRouteTableId,
      },
      PhysicalResourceId: `${tgw.TransitGatewayId}|cdke-lookup`,
    }
  } else {
    throw new Error(`Specified transit gateway was not found.`);
  }
}

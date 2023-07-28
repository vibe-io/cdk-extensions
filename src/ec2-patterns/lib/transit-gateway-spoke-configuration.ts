export interface TransitGatewaySpokeConfiguration {
  /**
     * The ID of a Transit Gateway. This Transit Gateway may have been created by another VPC in the
     * same account or shared by a VPC in another account. If this is passed then a Transit Gateway
     * Attachment will be created for the specified Transit Gateway and a new one will not be created
     * even if principals are provided.
     */
  readonly transitGatewayId: string;
}
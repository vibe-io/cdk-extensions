import { Fn } from 'aws-cdk-lib';


/**
 * Utility functions for working with AWS availability zones.
 */
export class AvailabilityZones {
  /**
     * Gets the first x availability zones for the region where this is being
     * called.
     *
     * @param count The number of availability zones to return.
     * @returns The first x availability zones for the region.
     */
  public static first(count: number): string[] {
    const azs = Fn.getAzs();
    return Array.from(Array(count).keys()).map((x) => {
      return Fn.select(x, azs);
    });
  }
}
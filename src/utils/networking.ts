/**
 * Converts an IP address from a dot notation string to an integer.
 *
 * @param dot A string specifying an IP address.
 * @returns The integer equivalent of the input address.
 */
export const dot2num = (dot: string): number => {
  let d = dot.split('.');
  return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
};

/**
 * Converts an integer representing an IP address to its equivalent string in
 * dot notation.
 *
 * @param num An integer representing an IP address.
 * @returns The dot notation equivalent of the input address.
 */
export const num2dot = (num: number): string => {
  let d = (num % 256).toString();
  for (var i = 3; i > 0; i--) {
    num = Math.floor(num / 256);
    d = num % 256 + '.' + d;
  }
  return d;
};

/**
 * Checks whether a given string is a valid IPv4 CIDR address.
 *
 * @param cidr A string representing a CIDR block to validate.
 * @returns A boolean indicating whether the given string is a valid IP
 * address or not.
 */
export const isValidCidr = (cidr: string): boolean => {
  return !!cidr.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(3[0-2]|[1-2][0-9]|[0-9]))$/);
};

/**
 * Gets the largest netmask which a CIDR can be divided into in order to break
 * the CIDR range into a given number of subnets.
 *
 * @param mask The netmask of the network being divided.
 * @param parts The number of subnets the CIDR will be divided into.
 * @returns The maximum netmask that can be used to get the requested number of
 * subnets from the CIDR range.
 */
export const getBiggestMask = (mask: number, parts: number): number => {
  return mask + Math.ceil(Math.log2(parts));
};

/**
 * Gets the total number of IP addresses that would be in a network with a
 * given netmask.
 *
 * @param mask The netmask to get the network size for.
 * @returns The network size of the given netmask.
 */
export const getNetworkSize = (mask: number): number => {
  return Math.pow(2, 32 - mask);
};

/**
 * Divides a CIDR range into a given number of subnets.
 *
 * Subnets will be the largest size possible while staying within bounds of
 * the specified CIDR.
 *
 * @param cidr The CIDR range to divide.
 * @param parts The number of subnets to divide the CIDR range into.
 * @param mask The netmask to use for the generate subnets.
 * @returns CIDR ranges for the requested number of subnets.
 */
export const divideCidr = (cidr: string, parts: number, mask?: number): string[] => {
  const netParts = cidr.split('/');
  const networkId = netParts[0];
  const netmask = parseInt(netParts[1]);

  const addr = dot2num(networkId);
  const limit = getBiggestMask(netmask, parts);
  const inMask = mask ?? limit;

  if (inMask < limit) {
    throw new Error([
      `Cannot get ${parts} subnets from CIDR '${cidr}' with a mask of`,
      `/${inMask}. The CIDR block is not big enough.`,
    ].join(' '));
  }

  const subnetSize = getNetworkSize(inMask);
  return Array.from(Array(parts).keys()).map((x) => {
    const outNetwork = num2dot(addr + (subnetSize * x));
    return `${outNetwork}/${inMask}`;
  });
};
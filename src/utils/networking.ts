export const dot2num = (dot: string): number => {
  let d = dot.split('.');
  return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
};

export const num2dot = (num: number): string => {
  let d = (num % 256).toString();
  for (var i = 3; i > 0; i--) {
    num = Math.floor(num / 256);
    d = num % 256 + '.' + d;
  }
  return d;
};

export const isValidCidr = (cidr: string): boolean => {
  return !!cidr.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(3[0-2]|[1-2][0-9]|[0-9]))$/);
};

export const divideCidr = (cidr: string, parts: number): string[] => {
  if (!isValidCidr(cidr)) {
    throw new Error(`Provided string '${cidr}' is not a valid cidr range.`);
  }

  const addr = dot2num(cidr.split('/')[0]);
  const inMask = parseInt(cidr.split('/')[1]);
  const outMask = inMask + Math.ceil(Math.log2(parts));
  const subnetSize = Math.pow(2, 32 - outMask);

  return Array.from(Array(parts).keys()).map((x) => {
    const outNetwork = num2dot(addr + (subnetSize * x));
    return `${outNetwork}/${outMask}`;
  });
};
export const convertBool = (input?: boolean): string | undefined => {
  if (input === undefined) {
    return undefined;
  } else {
    return input ? 'On' : 'Off';
  }
};
export const slug = (val: string) => {
  const results = val.split(' ').join('-');
  return results;
};

export const splitString = (val: string | undefined, index: number) => {
  if (!val) return;
  const splitPart = val.split('/');
  const lastPart = splitPart[splitPart.length - index];
  return lastPart;
};

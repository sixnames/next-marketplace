export const noNaN = (value: any) => {
  return value && !isNaN(+value) ? +value : 0;
};

interface GetPercentageInterface {
  fullValue?: number | null;
  partialValue?: number | null;
}
export const getPercentage = ({ fullValue, partialValue }: GetPercentageInterface): number => {
  const realFullValue = noNaN(fullValue);
  const realPartialValue = noNaN(partialValue);
  const fullPercent = 100;

  if (realFullValue === 0) {
    return fullPercent;
  }

  if (realPartialValue === 0) {
    return 0;
  }

  return fullPercent - Math.floor((realPartialValue / realFullValue) * fullPercent);
};

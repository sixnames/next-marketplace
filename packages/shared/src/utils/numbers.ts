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

  return (realPartialValue / realFullValue) * fullPercent;
};

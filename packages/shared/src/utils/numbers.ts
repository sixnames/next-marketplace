export const noNaN = (value: any) => {
  return value && !isNaN(+value) ? +value : 0;
};

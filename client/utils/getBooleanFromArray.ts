type ConditionType<T> = (item: T) => boolean;
function getBooleanFromArray<T>(arr: T[], condition: ConditionType<T>): boolean {
  const counter = arr.reduce((acc, item) => {
    if (condition(item)) {
      return acc + 1;
    }
    return acc;
  }, 0);
  return counter > 0;
}

export default getBooleanFromArray;

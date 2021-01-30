export const removeApolloFields = <T extends Record<string, any>>(
  object: T,
): Omit<T, '__typename'> => {
  const keys = Object.keys(object);

  return keys.reduce((acc: any, key) => {
    if (key === '__typename') {
      return acc;
    }

    return {
      ...acc,
      [key]: object[key],
    };
  }, {});
};

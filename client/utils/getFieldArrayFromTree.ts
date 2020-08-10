interface TreeItemInterface {
  [key: string]: any;
}

interface GetFieldArrayFromTreeInterface {
  field: string;
  tree: TreeItemInterface[];
}

function getFieldArrayFromTree({ tree, field }: GetFieldArrayFromTreeInterface) {
  const reducer = (item: TreeItemInterface, reducerAcc: string[]): string[] => {
    const { children } = item;
    if (children && children.length) {
      return [...children, { ...item, children: [] }].reduce(
        (acc: string[], item: TreeItemInterface) => [...acc, ...reducer(item, [])],
        reducerAcc,
      );
    }
    return [...reducerAcc, item[field]];
  };

  return tree.reduce((acc: string[], item) => {
    return [...acc, ...reducer(item, [])];
  }, []);
}

export default getFieldArrayFromTree;

interface NodeInterface {
  [key: string]: any;
}

type Tree = NodeInterface[];

interface UpdateItemInTreeInterface {
  target: any;
  targetKey?: string;
  childrenKey?: string;
  tree: Tree;
  updater: (node?: any) => any;
}

const updateItemInTree = ({
  target,
  targetKey = 'id',
  childrenKey = 'children',
  tree = [],
  updater,
}: UpdateItemInTreeInterface) => {
  const iterator = (tree: Tree): Tree =>
    tree.map((node: NodeInterface) => {
      if (node[targetKey] === target) {
        return updater(node);
      }

      if (node[childrenKey] && node[childrenKey].length) {
        return {
          ...node,
          [childrenKey]: updateItemInTree({
            target,
            targetKey,
            childrenKey,
            tree: node[childrenKey],
            updater,
          }),
        };
      }

      return node;
    });
  return target ? iterator(tree) : [...tree, updater()];
};

export default updateItemInTree;

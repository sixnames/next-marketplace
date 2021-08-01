import { GRID_SNIPPET_LAYOUT_BIG_IMAGE } from 'config/constantSelects';
import { ProductSnippetInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';

interface ProductSnippetGridInterface extends ProductSnippetInterface {
  gridSnippetLayout: string;
}

const ProductSnippetGridDefault = dynamic(() => import('layout/snippet/ProductSnippetGridDefault'));
const ProductSnippetGridBigImage = dynamic(
  () => import('layout/snippet/ProductSnippetGridBigImage'),
);

const ProductSnippetRow: React.FC<ProductSnippetGridInterface> = ({
  gridSnippetLayout,
  ...props
}) => {
  if (gridSnippetLayout === GRID_SNIPPET_LAYOUT_BIG_IMAGE) {
    return <ProductSnippetGridBigImage {...props} />;
  }

  return <ProductSnippetGridDefault {...props} />;
};

export default ProductSnippetRow;

import { GRID_SNIPPET_LAYOUT_BIG_IMAGE } from 'config/constantSelects';
import { ProductSnippetLayoutInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';

const ProductSnippetGridDefault = dynamic(() => import('layout/snippet/ProductSnippetGridDefault'));
const ProductSnippetGridBigImage = dynamic(
  () => import('layout/snippet/ProductSnippetGridBigImage'),
);

const ProductSnippetGrid: React.FC<ProductSnippetLayoutInterface> = ({ layout, ...props }) => {
  if (layout === GRID_SNIPPET_LAYOUT_BIG_IMAGE) {
    return <ProductSnippetGridBigImage {...props} />;
  }

  return <ProductSnippetGridDefault {...props} />;
};

export default ProductSnippetGrid;

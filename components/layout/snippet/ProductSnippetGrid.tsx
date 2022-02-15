import dynamic from 'next/dynamic';
import * as React from 'react';
import { GRID_SNIPPET_LAYOUT_BIG_IMAGE } from 'lib/config/constantSelects';
import { ProductSnippetLayoutInterface } from 'db/uiInterfaces';

const ProductSnippetGridDefault = dynamic(
  () => import('components/layout/snippet/ProductSnippetGridDefault'),
);
const ProductSnippetGridBigImage = dynamic(
  () => import('components/layout/snippet/ProductSnippetGridBigImage'),
);

const ProductSnippetGrid: React.FC<ProductSnippetLayoutInterface> = ({ layout, ...props }) => {
  if (layout === GRID_SNIPPET_LAYOUT_BIG_IMAGE) {
    return <ProductSnippetGridBigImage {...props} />;
  }

  return <ProductSnippetGridDefault {...props} />;
};

export default ProductSnippetGrid;

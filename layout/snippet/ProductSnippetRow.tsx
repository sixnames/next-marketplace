import { ROW_SNIPPET_LAYOUT_BIG_IMAGE } from 'config/constantSelects';
import { ProductSnippetLayoutInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';

const ProductSnippetRowDefault = dynamic(() => import('layout/snippet/ProductSnippetRowDefault'));
const ProductSnippetRowBigImage = dynamic(() => import('layout/snippet/ProductSnippetRowBigImage'));

const ProductSnippetRow: React.FC<ProductSnippetLayoutInterface> = ({ layout, ...props }) => {
  if (layout === ROW_SNIPPET_LAYOUT_BIG_IMAGE) {
    return <ProductSnippetRowBigImage {...props} />;
  }

  return <ProductSnippetRowDefault {...props} />;
};

export default ProductSnippetRow;

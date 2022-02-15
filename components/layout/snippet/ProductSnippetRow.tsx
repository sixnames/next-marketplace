import dynamic from 'next/dynamic';
import * as React from 'react';
import { ROW_SNIPPET_LAYOUT_BIG_IMAGE } from 'lib/config/constantSelects';
import { ProductSnippetLayoutInterface } from 'db/uiInterfaces';

const ProductSnippetRowDefault = dynamic(() => import('components/layout/snippet/ProductSnippetRowDefault'));
const ProductSnippetRowBigImage = dynamic(() => import('components/layout/snippet/ProductSnippetRowBigImage'));

const ProductSnippetRow: React.FC<ProductSnippetLayoutInterface> = ({ layout, ...props }) => {
  if (layout === ROW_SNIPPET_LAYOUT_BIG_IMAGE) {
    return <ProductSnippetRowBigImage {...props} />;
  }

  return <ProductSnippetRowDefault {...props} />;
};

export default ProductSnippetRow;

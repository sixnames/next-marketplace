import { ROW_SNIPPET_LAYOUT_BIG_IMAGE } from 'config/constantSelects';
import { ProductSnippetInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';

interface ProductSnippetRowInterface extends ProductSnippetInterface {
  rowSnippetLayout: string;
}

const ProductSnippetRowDefault = dynamic(() => import('layout/snippet/ProductSnippetRowDefault'));
const ProductSnippetRowBigImage = dynamic(() => import('layout/snippet/ProductSnippetRowBigImage'));

const ProductSnippetRow: React.FC<ProductSnippetRowInterface> = ({
  rowSnippetLayout,
  ...props
}) => {
  if (rowSnippetLayout === ROW_SNIPPET_LAYOUT_BIG_IMAGE) {
    return <ProductSnippetRowBigImage {...props} />;
  }

  return <ProductSnippetRowDefault {...props} />;
};

export default ProductSnippetRow;

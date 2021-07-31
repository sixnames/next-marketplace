import { ProductSnippetInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';

interface ProductSnippetRowInterface extends ProductSnippetInterface {
  rowSnippetLayout: string;
}

const ProductSnippetRowDefault = dynamic(() => import('layout/snippet/ProductSnippetRowDefault'));

const ProductSnippetRow: React.FC<ProductSnippetRowInterface> = ({ ...props }) => {
  return <ProductSnippetRowDefault {...props} />;
};

export default ProductSnippetRow;

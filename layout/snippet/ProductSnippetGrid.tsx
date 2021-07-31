import { ProductSnippetInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';

interface ProductSnippetGridInterface extends ProductSnippetInterface {
  gridSnippetLayout: string;
}

const ProductSnippetGridDefault = dynamic(() => import('layout/snippet/ProductSnippetGridDefault'));

const ProductSnippetRow: React.FC<ProductSnippetGridInterface> = ({ ...props }) => {
  return <ProductSnippetGridDefault {...props} />;
};

export default ProductSnippetRow;

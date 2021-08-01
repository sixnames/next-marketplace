import { ProductSnippetInterface } from 'db/uiInterfaces';
import * as React from 'react';

const ProductSnippetRowBigImage: React.FC<ProductSnippetInterface> = ({
  product,
  testId,
  className,
}) => {
  console.log({
    product,
    testId,
    className,
  });
  return (
    <div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid animi, cum doloribus dolorum
      eveniet iusto possimus similique soluta voluptatem voluptatibus! Culpa ea, id labore
      praesentium quo rem! Eligendi, laudantium, sint.
    </div>
  );
};

export default ProductSnippetRowBigImage;

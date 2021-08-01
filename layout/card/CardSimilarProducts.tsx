import HorizontalScroll from 'components/HorizontalScroll';
import { ProductInterface } from 'db/uiInterfaces';
import ProductSnippetGrid from 'layout/snippet/ProductSnippetGrid';
import * as React from 'react';

interface CardSimilarProductsInterface {
  similarProducts: ProductInterface[];
  gridSnippetLayout: string;
}

const CardSimilarProducts: React.FC<CardSimilarProductsInterface> = ({
  similarProducts,
  gridSnippetLayout,
}) => {
  if (similarProducts.length < 1) {
    return null;
  }

  return (
    <section className='mb-28'>
      <h2 className='text-2xl font-medium mb-6'>Вам может понравиться</h2>

      <HorizontalScroll>
        {similarProducts.map((product) => {
          return (
            <div className='flex min-w-[80vw] sm:min-w-[30rem]' key={`${product._id}`}>
              <ProductSnippetGrid
                gridSnippetLayout={gridSnippetLayout}
                noAttributes
                noSecondaryName
                product={product}
              />
            </div>
          );
        })}
      </HorizontalScroll>
    </section>
  );
};

export default CardSimilarProducts;

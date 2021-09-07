import HorizontalScroll from 'components/HorizontalScroll';
import { ProductInterface } from 'db/uiInterfaces';
import ProductSnippetGridBigImage from 'layout/snippet/ProductSnippetGridBigImage';
import * as React from 'react';

interface CardSimilarProductsInterface {
  similarProducts: ProductInterface[];
}

const CardSimilarProducts: React.FC<CardSimilarProductsInterface> = ({ similarProducts }) => {
  if (similarProducts.length < 1) {
    return null;
  }

  return (
    <section className='mb-28'>
      <h2 className='text-2xl font-medium mb-6'>Вам может понравиться</h2>

      <HorizontalScroll>
        {similarProducts.map((product) => {
          return (
            <div className='flex w-[270px] flex-shrink-0' key={`${product._id}`}>
              <ProductSnippetGridBigImage
                gridCatalogueColumns={'full'}
                noAttributes
                noSecondaryName
                showSnippetBackground
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

import * as React from 'react';
import HorizontalScroll from '../../components/HorizontalScroll';
import { ShopProductInterface } from '../../db/uiInterfaces';
import ProductSnippetGridBigImage from '../snippet/ProductSnippetGridBigImage';

interface CardSimilarProductsInterface {
  similarProducts: ShopProductInterface[];
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
                showSnippetArticle
                shopProduct={product}
              />
            </div>
          );
        })}
      </HorizontalScroll>
    </section>
  );
};

export default CardSimilarProducts;

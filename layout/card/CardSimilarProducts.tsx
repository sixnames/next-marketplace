import HorizontalScroll from 'components/HorizontalScroll';
import { GRID_SNIPPET_LAYOUT_BIG_IMAGE } from 'config/constantSelects';
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
  const widthClassName = React.useMemo(() => {
    if (gridSnippetLayout === GRID_SNIPPET_LAYOUT_BIG_IMAGE) {
      return 'min-w-[280px]';
    }

    return 'min-w-[80vw] sm:min-w-[30rem]';
  }, [gridSnippetLayout]);

  if (similarProducts.length < 1) {
    return null;
  }

  return (
    <section className='mb-28'>
      <h2 className='text-2xl font-medium mb-6'>Вам может понравиться</h2>

      <HorizontalScroll>
        {similarProducts.map((product) => {
          return (
            <div className={`flex ${widthClassName}`} key={`${product._id}`}>
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

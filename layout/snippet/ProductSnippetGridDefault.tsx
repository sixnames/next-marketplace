import { ROUTE_CATALOGUE } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { ProductSnippetInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Image from 'next/image';
import Link from 'components/Link/Link';
import RatingStars from 'components/RatingStars';
import ControlButton from 'components/ControlButton';
import ProductSnippetPrice from 'layout/snippet/ProductSnippetPrice';

const ProductSnippetGridDefault: React.FC<ProductSnippetInterface> = ({
  shopProduct,
  testId,
  className,
  noAttributes,
  showSnippetBackground = true,
  showSnippetButtonsOnHover = false,
  showSnippetArticle,
  showSnippetRating,
  gridCatalogueColumns,
}) => {
  const { configs } = useConfigContext();
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const { rubricSlug, product } = shopProduct;
  if (!product) {
    return null;
  }
  const {
    snippetTitle,
    slug,
    cardPrices,
    listFeatures,
    ratingFeatures,
    shopsCount,
    mainImage,
    shopProductsIds,
    itemId,
    name,
  } = product;
  const firstRatingFeature = ratingFeatures ? ratingFeatures[0] : null;

  const bgClassName = showSnippetBackground
    ? 'bg-secondary dark:shadow-md'
    : 'transition-all border-border-200 border hover:shadow-md';

  const columnsClassName =
    // 2
    gridCatalogueColumns === 2
      ? 'grid-snippet-2'
      : // 3
      gridCatalogueColumns === 3
      ? 'grid-snippet-3'
      : // 4
      gridCatalogueColumns === 4
      ? 'grid-snippet-4'
      : // 5
      gridCatalogueColumns === 5
      ? 'grid-snippet-5'
      : // 1
        ``;

  return (
    <div
      className={`group rounded-md flex flex-col relative gap-4 grid-snippet ${bgClassName} ${
        className ? className : columnsClassName
      }`}
    >
      {/*edit button for admin*/}
      {configs.showAdminUiInCatalogue ? (
        <div className='absolute top-0 left-0 z-50'>
          <ControlButton
            size={'small'}
            iconSize={'small'}
            icon={'pencil'}
            theme={'accent'}
            ariaLabel={'edit'}
            roundedTopLeft
            onClick={() => {
              window.open(
                `${configs.editLinkBasePath}/rubrics/${product.rubricId}/products/product/${product._id}`,
                '_blank',
              );
            }}
          />
        </div>
      ) : null}

      <div className='grid grid-cols-12 flex-grow'>
        {/*image*/}
        <div className='relative flex items-center justify-center flex-grow pt-4 pl-4 pr-4 col-span-3 dark:snippet-image'>
          <Image
            src={mainImage}
            objectFit={'contain'}
            objectPosition={'center'}
            alt={`${snippetTitle}`}
            title={`${snippetTitle}`}
            width={85}
            height={190}
            quality={50}
          />
          <Link
            testId={`${testId}-image-grid`}
            target={'_blank'}
            className='block absolute z-10 inset-0 text-indent-full'
            href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
          >
            {snippetTitle}
          </Link>
        </div>

        <div className='col-span-9 flex flex-col pt-12 pr-5 gap-4 min-h-[235px]'>
          <div className='mb-auto'>
            {/*name*/}
            <div className='mb-3'>
              <Link
                testId={`${testId}-name-grid`}
                target={'_blank'}
                className='text-lg sm:text-xl font-medium block text-primary-text hover:no-underline hover:text-primary-text'
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
              >
                {snippetTitle}
              </Link>
              {name ? <div className='text-secondary-text mt-1'>{name}</div> : null}
            </div>

            {/*art*/}
            {showSnippetArticle ? (
              <div className='text-secondary-text mb-5'>Артикул: {itemId}</div>
            ) : null}

            {/*list features*/}
            {noAttributes ? null : (
              <div className='text-sm text-secondary-text'>
                {(listFeatures || []).map(({ readableValue }, index) => {
                  if (!readableValue) {
                    return null;
                  }

                  const isLast = index === (listFeatures || []).length - 1;
                  return (
                    <span className='inline-block mr-1' key={`${readableValue}-${index}`}>
                      {isLast ? readableValue : `${readableValue},`}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/*price*/}
          <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
        </div>
      </div>

      <div className='grid grid-cols-12'>
        {/*rating*/}
        <div className='col-span-3 flex flex-col h-control-button-height'>
          {showSnippetRating ? (
            <div className='flex items-center justify-center h-control-button-height'>
              <RatingStars size={'small'} rating={4.9} />
            </div>
          ) : null}
        </div>

        <div className='col-span-9 flex flex-col h-control-button-height'>
          <div className='flex items-end justify-between h-control-button-height'>
            {/*rating features*/}
            <div className='flex flex-wrap items-center h-control-button-height'>
              {firstRatingFeature ? (
                <div
                  key={`${firstRatingFeature.attributeId}`}
                  className='text-secondary-text text-sm uppercase whitespace-nowrap mr-3 mt-1 mb-1'
                >
                  {`${firstRatingFeature.attribute?.name} ${firstRatingFeature.readableValue}`}
                </div>
              ) : null}
            </div>

            {/*controls*/}
            <div
              className={`flex items-center justify-end ${
                showSnippetButtonsOnHover
                  ? 'lg:opacity-0 group-hover:opacity-100 transition-all'
                  : ''
              }`}
            >
              <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
              <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
              <ControlButton
                ariaLabel={'Добавить в корзину'}
                testId={`${testId}-add-to-cart-grid`}
                theme={showSnippetBackground ? 'accent' : undefined}
                icon={'cart'}
                roundedTopLeft
                onClick={() => {
                  if (shopProductsIds && shopProductsIds.length < 2) {
                    addProductToCart({
                      amount: 1,
                      productId: product._id,
                      shopProductId: `${shopProductsIds[0]}`,
                    });
                  } else {
                    addShoplessProductToCart({
                      amount: 1,
                      productId: product._id,
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSnippetGridDefault;

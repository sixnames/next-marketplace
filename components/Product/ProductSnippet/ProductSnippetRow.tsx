import { CatalogueProductInterface } from 'db/dbModels';
import useCartMutations from 'hooks/useCartMutations';
import * as React from 'react';
import classes from './ProductSnippetRow.module.css';
import LayoutCard from '../../../layout/LayoutCard/LayoutCard';
import RatingStars from '../../RatingStars/RatingStars';
import Image from 'next/image';
import ProductMarker from '../ProductMarker/ProductMarker';
import Link from '../../Link/Link';
import ProductSnippetPrice from '../ProductSnippetPrice/ProductSnippetPrice';
import SpinnerInput from '../../FormElements/SpinnerInput/SpinnerInput';
import Button from '../../Buttons/Button';
import ControlButton from '../../Buttons/ControlButton';
import { noNaN } from 'lib/numbers';

interface ProductSnippetRowInterface {
  product: CatalogueProductInterface;
  testId?: string;
  additionalSlug?: string;
  className?: string;
}

const ProductSnippetRow: React.FC<ProductSnippetRowInterface> = ({
  product,
  testId,
  additionalSlug,
  className,
}) => {
  const [amount, setAmount] = React.useState<number>(1);
  const { addShoplessProductToCart } = useCartMutations();
  const {
    name,
    originalName,
    slug,
    cardPrices,
    _id,
    itemId,
    listFeatures,
    ratingFeatures,
    connections,
    shopsCount,
    isCustomersChoice,
  } = product;
  const additionalLinkSlug = additionalSlug ? additionalSlug : '';
  const shopsCounterPostfix = noNaN(shopsCount) > 1 ? 'винотеках' : 'винотеке';
  const isShopless = noNaN(shopsCount) < 1;
  const mainImage = product.mainImage || `${process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK}`;

  return (
    <LayoutCard className={`${classes.snippetCard} ${className ? className : ''}`} testId={testId}>
      <div className={`${classes.leftColumn}`}>
        <div className={`${classes.image}`}>
          <Image
            priority={true}
            src={mainImage}
            objectFit={'contain'}
            objectPosition={'center'}
            alt={originalName}
            title={originalName}
            width={100}
            height={250}
            quality={50}
          />
        </div>
        <div className={`${classes.rating}`}>
          <RatingStars size={'small'} rating={4.9} />
        </div>
      </div>

      <div>
        <div className={classes.art}>Артикул: {itemId}</div>
        <div className={classes.content}>
          <div className={classes.contentColumn}>
            <div className={classes.name}>{originalName}</div>
            <div className={classes.nameTranslation}>{name}</div>
            <div className={classes.listFeatures}>
              {(listFeatures || []).map(({ attributeName, attributeId, readableValue }) => {
                return (
                  <React.Fragment key={`${attributeId}`}>
                    <div className={classes.listFeaturesLabel}>{attributeName}</div>
                    <div className={classes.listFeaturesValue}>{readableValue}</div>
                  </React.Fragment>
                );
              })}
            </div>

            <div className={classes.mainContentBottom}>
              <div className={classes.outerRatingList}>
                {(ratingFeatures || []).map(({ attributeId, attributeName, readableValue }) => {
                  return (
                    <div key={`${attributeId}`} className={classes.outerRating}>
                      {`${attributeName} ${readableValue}`}
                    </div>
                  );
                })}
              </div>

              <div className={classes.btns}>
                <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
                <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
              </div>
            </div>
          </div>

          <div className={classes.contentColumn}>
            {isShopless ? null : (
              <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
            )}

            <div className={classes.productConnections}>
              {connections.map(({ _id, attributeName, connectionProducts }) => {
                return (
                  <div key={`${_id}`} className={classes.connectionsGroup}>
                    <div className={classes.connectionsGroupLabel}>{`${attributeName}:`}</div>
                    {connectionProducts.map(({ option, _id }, index) => {
                      const isLast = connectionProducts.length - 1 === index;
                      const isCurrent = _id === product._id;

                      return (
                        <span
                          key={`${option._id}`}
                          className={`${classes.connectionsGroupValue} ${
                            isCurrent ? classes.connectionsGroupCurrentValue : ''
                          }`}
                        >
                          {isLast ? option.name : `${option.name}, `}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className={classes.inputs}>
              <div className={classes.shopsCounter}>
                {noNaN(shopsCount) > 0
                  ? `В наличии в ${shopsCount} ${shopsCounterPostfix}`
                  : 'Нет в наличии'}
              </div>

              <SpinnerInput
                plusTestId={`card-shops-${slug}-plus`}
                minusTestId={`card-shops-${slug}-minus`}
                testId={`card-shops-${slug}-input`}
                onChange={(e) => {
                  setAmount(noNaN(e.target.value));
                }}
                className={classes.input}
                min={1}
                name={'amount'}
                value={amount}
                disabled={isShopless}
              />
            </div>

            <Button
              disabled={isShopless}
              theme={'gray'}
              testId={`card-shops-${slug}-add-to-cart`}
              ariaLabel={'Добавить в корзину'}
              onClick={() => {
                addShoplessProductToCart({
                  amount,
                  productId: _id,
                });
              }}
            >
              В корзину
            </Button>
          </div>
        </div>
      </div>

      {isCustomersChoice ? <ProductMarker>Выбор покупателей</ProductMarker> : null}

      <Link
        // style={{ display: 'none' }}
        prefetch={false}
        className={classes.link}
        href={`/product${additionalLinkSlug}/${slug}`}
      >
        {originalName}
      </Link>
    </LayoutCard>
  );
};

export default ProductSnippetRow;

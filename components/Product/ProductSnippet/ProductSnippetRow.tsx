import useCartMutations from 'hooks/useCartMutations';
import useSessionCity from 'hooks/useSessionCity';
import * as React from 'react';
import classes from './ProductSnippetRow.module.css';
import { ProductSnippetFragment } from 'generated/apolloComponents';
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
  product: ProductSnippetFragment;
  testId?: string;
  additionalSlug?: string;
}

const ProductSnippetRow: React.FC<ProductSnippetRowInterface> = ({
  product,
  testId,
  additionalSlug,
}) => {
  const city = useSessionCity();
  const [amount, setAmount] = React.useState<number>(1);
  const { addShoplessProductToCart } = useCartMutations();
  const {
    name,
    originalName,
    mainImage,
    slug,
    cardPrices,
    _id,
    itemId,
    listFeatures,
    ratingFeatures,
    connections,
    shopsCount,
  } = product;
  const additionalLinkSlug = additionalSlug ? additionalSlug : '';
  const shopsCounterPostfix = shopsCount > 1 ? 'винотеках' : 'винотеке';
  const isShopless = shopsCount < 1;

  return (
    <LayoutCard className={classes.snippetCard} testId={testId}>
      <div className={`${classes.leftColumn}`}>
        <div className={`${classes.image}`}>
          <div className={classes.imageHolder}>
            <Image
              src={mainImage}
              layout='fill'
              objectFit='contain'
              alt={originalName}
              title={originalName}
            />
          </div>
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
              {listFeatures.map(({ attributeName, attributeId, readableValue }) => {
                return (
                  <React.Fragment key={attributeId}>
                    <div className={classes.listFeaturesLabel}>{attributeName}</div>
                    <div className={classes.listFeaturesValue}>{readableValue}</div>
                  </React.Fragment>
                );
              })}
            </div>

            <div className={classes.mainContentBottom}>
              <div className={classes.outerRatingList}>
                {ratingFeatures.map(({ attributeId, attributeName, readableValue }) => {
                  return (
                    <div key={attributeId} className={classes.outerRating}>
                      {`${attributeName} ${readableValue}`}
                    </div>
                  );
                })}
              </div>

              <div className={classes.btns}>
                <ControlButton icon={'compare'} />
                <ControlButton icon={'heart'} />
              </div>
            </div>
          </div>

          <div className={classes.contentColumn}>
            {isShopless ? null : <ProductSnippetPrice value={cardPrices.min} />}

            <div className={classes.productConnections}>
              {connections.map(({ _id, attributeName, connectionProducts }) => {
                return (
                  <div key={_id} className={classes.connectionsGroup}>
                    <div className={classes.connectionsGroupLabel}>{`${attributeName}:`}</div>
                    {connectionProducts.map(({ option, _id }, index) => {
                      const isLast = connectionProducts.length - 1 === index;
                      const isCurrent = _id === product._id;

                      return (
                        <span
                          key={option._id}
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
                {shopsCount > 0
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

      <ProductMarker>Выбор покупателей</ProductMarker>

      <Link
        // style={{ display: 'none' }}
        className={classes.link}
        href={`/${city}/product${additionalLinkSlug}/${slug}`}
      >
        {originalName}
      </Link>
    </LayoutCard>
  );
};

export default ProductSnippetRow;

import * as React from 'react';
import classes from './ProductSnippetRow.module.css';
import { ProductSnippetFragment } from 'generated/apolloComponents';
import { useSiteContext } from 'context/siteContext';
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
  const [amount, setAmount] = React.useState<number>(1);
  const { addShoplessProductToCart } = useSiteContext();
  const {
    name,
    mainImage,
    slug,
    cardPrices,
    _id,
    itemId,
    cardFeatures,
    snippetFeatures,
    cardConnections,
    shopsCount,
  } = product;
  const additionalLinkSlug = additionalSlug ? additionalSlug : '';

  const { ratingFeaturesValues } = snippetFeatures;
  const { listFeatures } = cardFeatures;
  const shopsCounterPostfix = shopsCount > 1 ? 'винотеках' : 'винотеке';

  return (
    <LayoutCard className={classes.snippetCard} testId={testId}>
      <div className={`${classes.leftColumn}`}>
        <div className={`${classes.image}`}>
          <div className={classes.imageHolder}>
            <Image src={mainImage} layout='fill' objectFit='contain' alt={name} title={name} />
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
            <div className={classes.name}>{name}</div>
            <div className={classes.listFeatures}>
              {listFeatures.map(({ attribute, selectedOptions }) => {
                return (
                  <React.Fragment key={attribute._id}>
                    <div className={classes.listFeaturesLabel}>{attribute.name}</div>
                    <div className={classes.listFeaturesValue}>
                      {selectedOptions.map(({ name }, index) => {
                        const isLastOption = selectedOptions.length - 1 === index;
                        return isLastOption ? name : `${name}, `;
                      })}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <div className={classes.mainContentBottom}>
              <div className={classes.outerRatingList}>
                {ratingFeaturesValues.map((rating) => {
                  return (
                    <div key={rating} className={classes.outerRating}>
                      {rating}
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
            <ProductSnippetPrice value={cardPrices.min} />

            <div className={classes.productConnections}>
              {cardConnections.map(({ _id, name, connectionProducts }) => {
                return (
                  <div key={_id} className={classes.connectionsGroup}>
                    <div className={classes.connectionsGroupLabel}>{`${name}:`}</div>
                    {connectionProducts.map(({ value, _id, isCurrent }, index) => {
                      const isLast = connectionProducts.length - 1 === index;
                      return (
                        <span
                          key={_id}
                          className={`${classes.connectionsGroupValue} ${
                            isCurrent ? classes.connectionsGroupCurrentValue : ''
                          }`}
                        >
                          {isLast ? value : `${value}, `}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className={classes.inputs}>
              <div
                className={classes.shopsCounter}
              >{`В наличии в ${shopsCount} ${shopsCounterPostfix}`}</div>

              <SpinnerInput
                plusTestId={`card-shops-${_id}-plus`}
                minusTestId={`card-shops-${_id}-minus`}
                testId={`card-shops-${_id}-input`}
                onChange={(e) => {
                  setAmount(noNaN(e.target.value));
                }}
                className={classes.input}
                min={1}
                name={'amount'}
                value={amount}
              />
            </div>

            <Button
              theme={'gray'}
              testId={`card-shops-${_id}-add-to-cart`}
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
        href={{
          pathname: `/product${additionalLinkSlug}/${slug}`,
        }}
      >
        {name}
      </Link>
    </LayoutCard>
  );
};

export default ProductSnippetRow;
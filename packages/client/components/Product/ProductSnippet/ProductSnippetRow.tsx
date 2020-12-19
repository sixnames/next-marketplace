import React, { Fragment, useState } from 'react';
import classes from './ProductSnippetRow.module.css';
import { ProductSnippetFragment } from '../../../generated/apolloComponents';
import { useSiteContext } from '../../../context/siteContext';
import LayoutCard from '../../../layout/LayoutCard/LayoutCard';
import Image from '../../Image/Image';
import RatingStars from '../../RatingStars/RatingStars';
import ProductMarker from '../ProductMarker/ProductMarker';
import Link from '../../Link/Link';
import ProductSnippetPrice from '../ProductSnippetPrice/ProductSnippetPrice';
import { noNaN } from '@yagu/shared';
import SpinnerInput from '../../FormElements/SpinnerInput/SpinnerInput';
import Button from '../../Buttons/Button';
import ControlButton from '../../Buttons/ControlButton';

interface ProductSnippetRowInterface {
  product: ProductSnippetFragment;
  testId?: string;
  rubricSlug?: string;
}

const ProductSnippetRow: React.FC<ProductSnippetRowInterface> = ({
  product,
  testId,
  rubricSlug,
}) => {
  const [amount, setAmount] = useState<number>(1);
  const { addShoplessProductToCart } = useSiteContext();
  const {
    nameString,
    mainImage,
    slug,
    cardPrices,
    id,
    itemId,
    cardFeatures,
    cardConnections,
    shopsCount,
  } = product;
  const imageWidth = 50;
  const linkQuery: Record<string, any> = {};

  const { listFeatures, ratingFeaturesValues } = cardFeatures;

  const shopsCounterPostfix = shopsCount > 1 ? 'винотеках' : 'винотеке';

  if (rubricSlug) {
    linkQuery.rubric = rubricSlug;
  }
  return (
    <LayoutCard className={classes.snippetCard} testId={testId}>
      <div className={`${classes.leftColumn}`}>
        <div className={`${classes.image}`}>
          <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
        </div>
        <div className={`${classes.rating} ${classes.leftColumn}`}>
          <RatingStars size={'small'} rating={4.9} />
        </div>
      </div>

      <div>
        <div className={classes.art}>Артикул: {itemId}</div>
        <div className={classes.content}>
          <div className={classes.contentColumn}>
            <div className={classes.name}>{nameString}</div>
            <div className={classes.listFeatures}>
              {listFeatures.map(({ readableValue, node }) => {
                return (
                  <Fragment key={node.id}>
                    <div className={classes.listFeaturesLabel}>{node.nameString}</div>
                    <div className={classes.listFeaturesValue}>{readableValue}</div>
                  </Fragment>
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
              {cardConnections.map(({ id, nameString, products }) => {
                return (
                  <div key={id} className={classes.connectionsGroup}>
                    <div className={classes.connectionsGroupLabel}>{`${nameString}:`}</div>
                    {products.map(({ value, id, isCurrent }) => {
                      if (isCurrent) {
                        return <span key={id}>{value}</span>;
                      }
                      return null;
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
              />
            </div>

            <Button
              theme={'gray'}
              testId={`card-shops-${slug}-add-to-cart`}
              onClick={() => {
                addShoplessProductToCart({
                  amount,
                  productId: id,
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
          pathname: `/product/${slug}`,
          query: linkQuery,
        }}
      >
        {nameString}
      </Link>
    </LayoutCard>
  );
};

export default ProductSnippetRow;

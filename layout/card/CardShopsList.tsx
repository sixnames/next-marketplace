import ArrowTrigger from 'components/ArrowTrigger';
import ShopsMap from 'components/ShopsMap';
import { ShopInterface, ShopProductInterface } from 'db/uiInterfaces';
import * as React from 'react';
import CardShop from 'routes/CardRoute/CardShop';

interface CardShopsListInterface {
  cardShopProducts?: ShopProductInterface[] | undefined;
}

const CardShopsList: React.FC<CardShopsListInterface> = ({ cardShopProducts }) => {
  const [isMap, setIsMap] = React.useState<boolean>(false);
  const shopsSnippets = React.useMemo(() => {
    return (cardShopProducts || []).reduce((acc: ShopInterface[], { shop }) => {
      if (!shop) {
        return acc;
      }
      return [...acc, shop];
    }, []);
  }, [cardShopProducts]);

  return (
    <section id={`card-shops`} className='mb-28'>
      <div className='mb-6 flex flex-col gap-4 items-baseline sm:flex-row sm:justify-between'>
        <h2 className='text-2xl font-medium'>Наличие в магазинах</h2>

        <ArrowTrigger
          arrowPosition={isMap ? 'left' : 'right'}
          name={isMap ? 'К списку магазинов' : 'Показать на карте'}
          onClick={() => setIsMap((prevState) => !prevState)}
        />
      </div>

      <div data-cy={`card-shops`}>
        {isMap ? (
          <div data-cy={`card-shops-map`}>
            <ShopsMap shops={shopsSnippets} />
          </div>
        ) : (
          <div data-cy={`card-shops-list`}>
            {(cardShopProducts || []).map((shopProduct, index) => {
              return (
                <CardShop
                  testId={`1-${index}`}
                  key={`${shopProduct._id}`}
                  shopProduct={shopProduct}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CardShopsList;

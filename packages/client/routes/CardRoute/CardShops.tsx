import React, { useEffect, useState } from 'react';
import {
  GetProductShopsInput,
  ProductCardShopFragment,
  SortDirectionEnum,
  useGetCatalogueCardShopsQuery,
} from '../../generated/apolloComponents';
import { SORT_ASC, SORT_DESC } from '@yagu/config';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import MenuButtonWithName from '../../components/ReachMenuButton/MenuButtonWithName';
import CardShop from './CardShop';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import Button from '../../components/Buttons/Button';
import classes from './CardShops.module.css';
import ArrowTrigger from '../../components/ArrowTrigger/ArrowTrigger';
import ShopsMap from '../../components/ShopsMap/ShopsMap';

interface CardShopsListInterface {
  productId: string;
  shops: ProductCardShopFragment[];
  setInput: React.Dispatch<React.SetStateAction<GetProductShopsInput>>;
  setIsMap: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const CardShopsList: React.FC<CardShopsListInterface> = ({
  shops,
  loading,
  productId,
  setIsMap,
  setInput,
}) => {
  const [isShopsOpen, setIsShopsOpen] = useState<boolean>(false);

  const visibleShopsLimit = 4;
  const visibleShops = shops.slice(0, visibleShopsLimit);
  const hiddenShops = shops.slice(visibleShopsLimit);

  const sortConfig = [
    {
      nameString: 'По возрастанию цены',
      id: 'По возрастанию цены',
      onSelect: () => {
        setInput({
          productId,
          sortBy: 'price',
          sortDir: SORT_ASC as SortDirectionEnum,
        });
      },
    },
    {
      nameString: 'По убыванию цены',
      id: 'По убыванию цены',
      onSelect: () => {
        setInput({
          productId,
          sortBy: 'price',
          sortDir: SORT_DESC as SortDirectionEnum,
        });
      },
    },
  ];

  return (
    <div data-cy={`card-shops-list`}>
      <div className={classes.controls}>
        <div className={classes.sort}>
          <div className={classes.sortLabel}>Сортировать</div>
          <MenuButtonWithName config={sortConfig} />
        </div>
        <ArrowTrigger name={'Ближайшие винотеки на карте'} onClick={() => setIsMap(true)} />
      </div>

      {visibleShops.map((shop) => {
        return <CardShop key={shop.id} shopProduct={shop} />;
      })}

      {hiddenShops.length > 0 ? (
        <Disclosure onChange={() => setIsShopsOpen((prevState) => !prevState)}>
          <DisclosurePanel>
            <div>
              {hiddenShops.map((shop) => {
                return <CardShop key={shop.id} shopProduct={shop} />;
              })}
            </div>
          </DisclosurePanel>
          <DisclosureButton as={'div'}>
            <Button className={classes.moreShopsButton} theme={'secondary'}>
              {isShopsOpen ? 'Показать меньше магазинов' : 'Показать больше магазинов'}
            </Button>
          </DisclosureButton>
        </Disclosure>
      ) : null}

      {loading ? <Spinner isNestedAbsolute /> : null}
    </div>
  );
};

interface CardShopsMapInterface {
  shops: ProductCardShopFragment[];
  setIsMap: React.Dispatch<React.SetStateAction<boolean>>;
}

const CardShopsMap: React.FC<CardShopsMapInterface> = ({ shops, setIsMap }) => {
  const shopsSnippets = shops.map(({ shop }) => shop);
  return (
    <div data-cy={`card-shops-map`}>
      <div className={classes.controls}>
        <ArrowTrigger
          arrowPosition={'left'}
          name={'Вернуться ко всем магазинам'}
          onClick={() => setIsMap(false)}
        />
      </div>

      <ShopsMap shops={shopsSnippets} />
    </div>
  );
};

interface CardShopsInterface {
  productId: string;
}

const CardShops: React.FC<CardShopsInterface> = ({ productId }) => {
  const [isMap, setIsMap] = useState<boolean>(false);
  const [shops, setShops] = useState<ProductCardShopFragment[] | null>(null);
  const [input, setInput] = useState<GetProductShopsInput>(() => ({
    productId,
    sortBy: 'price',
    sortDir: SORT_ASC as SortDirectionEnum,
  }));
  const { data, loading, error } = useGetCatalogueCardShopsQuery({
    variables: {
      input,
    },
  });

  useEffect(() => {
    if (data && !error && !loading) {
      setShops(data.getProductShops);
    }
  }, [data, loading, error]);

  if (error) {
    return <RequestError message={'Ошибка загрузки магазинов'} />;
  }

  if (!shops) {
    return <Spinner isNested />;
  }

  return (
    <div className={classes.frame} data-cy={`card-shops`}>
      {isMap ? (
        <CardShopsMap shops={shops} setIsMap={setIsMap} />
      ) : (
        <CardShopsList
          productId={productId}
          setInput={setInput}
          shops={shops}
          loading={loading}
          setIsMap={setIsMap}
        />
      )}
    </div>
  );
};

export default CardShops;

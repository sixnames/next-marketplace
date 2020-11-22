import React, { Fragment, useEffect, useState } from 'react';
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

interface CardShopsListInterface extends CardShopsInterface {
  productId: string;
  shops: ProductCardShopFragment[];
  setInput: React.Dispatch<React.SetStateAction<GetProductShopsInput>>;
  loading: boolean;
}

const CardShopsList: React.FC<CardShopsListInterface> = ({
  shops,
  loading,
  productId,
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
    <Fragment>
      <div className={classes.controls}>
        <div className={classes.sort}>
          <div className={classes.sortLabel}>Сортировать</div>
          <MenuButtonWithName config={sortConfig} />
        </div>
      </div>

      {visibleShops.map((shop) => {
        return <CardShop key={shop.id} shop={shop} />;
      })}

      {hiddenShops.length > 0 ? (
        <Disclosure onChange={() => setIsShopsOpen((prevState) => !prevState)}>
          <DisclosurePanel>
            <div>
              {hiddenShops.map((shop) => {
                return <CardShop key={shop.id} shop={shop} />;
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
    </Fragment>
  );
};

interface CardShopsInterface {
  productId: string;
}

const CardShops: React.FC<CardShopsInterface> = ({ productId }) => {
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
    <div className={classes.frame}>
      <CardShopsList productId={productId} setInput={setInput} shops={shops} loading={loading} />
    </div>
  );
};

export default CardShops;

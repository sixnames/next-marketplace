import * as React from 'react';
import {
  GetProductShopsInput,
  ShopProductSnippetFragment,
  SortDirection,
} from 'generated/apolloComponents';
// import Spinner from '../../components/Spinner/Spinner';
import CardShop from './CardShop';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import Button from '../../components/Buttons/Button';
import classes from './CardShops.module.css';
import ArrowTrigger from '../../components/ArrowTrigger/ArrowTrigger';
import ShopsMap from '../../components/ShopsMap/ShopsMap';
import MenuButtonSorter from '../../components/ReachMenuButton/MenuButtonSorter';
import ReachMenuButton, {
  ReachMenuItemConfig,
} from '../../components/ReachMenuButton/ReachMenuButton';
import { useAppContext } from 'context/appContext';
import { SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY, SORT_ASC_STR, SORT_DESC_STR } from 'config/common';

interface CardShopsListInterface {
  productId: string;
  shops: ShopProductSnippetFragment[];
  input: GetProductShopsInput;
  setInput: React.Dispatch<React.SetStateAction<GetProductShopsInput>>;
  setIsMap: React.Dispatch<React.SetStateAction<boolean>>;
  // loading: boolean;
}

const CardShopsList: React.FC<CardShopsListInterface> = ({
  shops,
  // loading,
  productId,
  setIsMap,
  setInput,
  input,
}) => {
  const { isMobile } = useAppContext();
  const [isShopsOpen, setIsShopsOpen] = React.useState<boolean>(false);

  const visibleShopsLimit = 4;
  const visibleShops = shops.slice(0, visibleShopsLimit);
  const hiddenShops = shops.slice(visibleShopsLimit);

  const sortConfig: ReachMenuItemConfig[] = React.useMemo(
    () => [
      {
        _id: 'По возрастанию цены',
        name: 'По возрастанию цены',
        current: input.sortBy === 'price' && input.sortDir === SORT_ASC_STR,
        onSelect: () => {
          setInput({
            productId,
            sortBy: 'price',
            sortDir: SORT_ASC_STR as SortDirection,
          });
        },
      },
      {
        _id: 'По убыванию цены',
        name: 'По убыванию цены',
        current: input.sortBy === 'price' && input.sortDir === SORT_DESC_STR,
        onSelect: () => {
          setInput({
            productId,
            sortBy: 'price',
            sortDir: SORT_DESC_STR as SortDirection,
          });
        },
      },
    ],
    [input, productId, setInput],
  );
  // TODO sort shops
  return (
    <div data-cy={`card-shops-list`}>
      {isMobile ? (
        <div className={classes.controlsMobile}>
          <ReachMenuButton
            config={sortConfig}
            buttonAs={'div'}
            buttonText={() => (
              <Button className={classes.controlsMobileButn} theme={'secondary'}>
                Сортировать
              </Button>
            )}
          />
          <Button
            className={classes.controlsMobileButn}
            theme={'secondary'}
            onClick={() => setIsMap(true)}
          >
            Показать ближайшие
          </Button>
        </div>
      ) : (
        <div className={classes.controls}>
          <MenuButtonSorter config={sortConfig} />
          <ArrowTrigger name={'Ближайшие винотеки на карте'} onClick={() => setIsMap(true)} />
        </div>
      )}

      {visibleShops.map((shop) => {
        return <CardShop key={shop._id} shopProduct={shop} />;
      })}

      {hiddenShops.length > 0 ? (
        <Disclosure onChange={() => setIsShopsOpen((prevState) => !prevState)}>
          <DisclosurePanel>
            <div>
              {hiddenShops.map((shop) => {
                return <CardShop key={shop._id} shopProduct={shop} />;
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

      {/*{loading ? <Spinner isNestedAbsolute /> : null}*/}
    </div>
  );
};

interface CardShopsMapInterface {
  shops: ShopProductSnippetFragment[];
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
  initialShops: ShopProductSnippetFragment[];
}

const CardShops: React.FC<CardShopsInterface> = ({ productId, initialShops }) => {
  const [isMap, setIsMap] = React.useState<boolean>(false);
  // const [shops] = React.useState<ShopProductSnippetFragment[]>(() => initialShops);
  const [input, setInput] = React.useState<GetProductShopsInput>(() => ({
    productId,
    sortBy: SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
    sortDir: SORT_ASC_STR as SortDirection,
  }));
  /*const { data, loading, error } = useGetCatalogueCardShopsQuery({
    variables: {
      input,
    },
  });*/

  /*React.useEffect(() => {
    if (data && !error && !loading) {
      setShops(data.getProductShops);
    }
  }, [data, loading, error]);*/

  /*if (error) {
    return <RequestError message={'Ошибка загрузки магазинов'} />;
  }*/

  return (
    <div className={classes.frame} data-cy={`card-shops`}>
      {isMap ? (
        <CardShopsMap shops={initialShops} setIsMap={setIsMap} />
      ) : (
        <CardShopsList
          productId={productId}
          input={input}
          setInput={setInput}
          shops={initialShops}
          // loading={loading}
          setIsMap={setIsMap}
        />
      )}
    </div>
  );
};

export default CardShops;

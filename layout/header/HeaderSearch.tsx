import { useRouter } from 'next/router';
import * as React from 'react';
import { useDebounce } from 'use-debounce';
import OutsideClickHandler from 'react-outside-click-handler';
import ControlButton from '../../components/button/ControlButton';
import WpInput from '../../components/FormElements/Input/WpInput';
import Inner from '../../components/Inner';
import WpLink from '../../components/Link/WpLink';
import Spinner from '../../components/Spinner';
import { REQUEST_METHOD_POST, ROUTE_SEARCH_RESULT } from '../../config/common';
import { useSiteContext } from '../../context/siteContext';
import { ShopProductInterface } from '../../db/uiInterfaces';
import {
  HeaderSearchInputInterface,
  HeaderSearchPayloadInterface,
} from '../../pages/api/search/header-search';
import ProductSnippetGridBigImage from '../snippet/ProductSnippetGridBigImage';

interface HeaderSearchResultInterface {
  shopProducts?: ShopProductInterface[] | null;
  setIsSearchOpen: (value: boolean) => void;
  isProductsFound: boolean;
  string: string;
}

const HeaderSearchResult: React.FC<HeaderSearchResultInterface> = ({
  setIsSearchOpen,
  shopProducts,
  isProductsFound,
  string,
}) => {
  const { urlPrefix } = useSiteContext();
  if (!shopProducts || shopProducts.length < 1) {
    return null;
  }

  return (
    <div>
      <div className='grid gap-6 items-stretch sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {shopProducts.map((product) => {
          return (
            <ProductSnippetGridBigImage
              gridCatalogueColumns={'full'}
              showSnippetBackground
              shopProduct={product}
              testId={`search-product`}
              key={`${product._id}`}
            />
          );
        })}
      </div>
      {isProductsFound ? (
        <WpLink
          className='flex items-center min-h-[var(--minLinkHeightSmall)] text-theme'
          href={`${urlPrefix}${ROUTE_SEARCH_RESULT}/${encodeURIComponent(string)}`}
          onClick={() => {
            setIsSearchOpen(false);
          }}
        >
          <span className='overflow-ellipsis whitespace-nowrap'>Показать все результаты</span>
        </WpLink>
      ) : null}
    </div>
  );
};

interface HeaderSearchInterface {
  setIsSearchOpen: (value: boolean) => void;
}

const minSearchLength = 2;

const HeaderSearch: React.FC<HeaderSearchInterface> = ({ setIsSearchOpen }) => {
  const router = useRouter();
  const { domainCompany, urlPrefix } = useSiteContext();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchResult, setSearchResult] = React.useState<ShopProductInterface[] | null>(null);
  const [topShopProducts, setTopShopProducts] = React.useState<ShopProductInterface[] | null>(null);
  const [string, setString] = React.useState<string>('');
  const [value] = useDebounce(string, 500);

  // get top products
  React.useEffect(() => {
    if (!topShopProducts) {
      setLoading(true);
      const body: HeaderSearchInputInterface = {
        companySlug: domainCompany?.slug,
        companyId: domainCompany ? `${domainCompany._id}` : undefined,
      };

      fetch('/api/search/header-search', {
        method: REQUEST_METHOD_POST,
        body: JSON.stringify(body),
      })
        .then<HeaderSearchPayloadInterface>((res) => res.json())
        .then((result) => {
          setLoading(false);
          setTopShopProducts(result.shopProducts);
        })
        .catch(console.log);
    }
  }, [domainCompany, topShopProducts]);

  // get search result
  React.useEffect(() => {
    if (value && value.length > minSearchLength) {
      setLoading(true);
      const body: HeaderSearchInputInterface = {
        companySlug: domainCompany?.slug,
        companyId: domainCompany ? `${domainCompany._id}` : undefined,
        search: value,
      };

      fetch('/api/search/header-search', {
        method: REQUEST_METHOD_POST,
        body: JSON.stringify(body),
      })
        .then<HeaderSearchPayloadInterface>((res) => res.json())
        .then((result) => {
          setLoading(false);
          setSearchResult(result.shopProducts);
        })
        .catch(console.log);
    }
  }, [domainCompany, value]);

  return (
    <div
      className='fixed z-[110] inset-0 overflow-y-auto pb-8 bg-primary-dark shadow-lg lg:pb-4 lg:inset-y-auto lg:top-full lg:w-full lg:absolute'
      data-cy={'search-dropdown'}
    >
      <OutsideClickHandler onOutsideClick={() => setIsSearchOpen(false)}>
        <Inner lowBottom>
          <div className='pt-8 min-h-8 mb-8 text-xl font-medium text-center lg:hidden'>Поиск</div>

          <div className='flex'>
            <form
              className='flex-grow relative'
              onSubmit={(e) => {
                e.preventDefault();
                if (string && string.length > minSearchLength) {
                  router
                    .push(`${urlPrefix}${ROUTE_SEARCH_RESULT}/${encodeURIComponent(string)}`)
                    .catch(console.log);
                }
              }}
            >
              <WpInput
                onChange={(e) => setString(e.target.value)}
                name={'search'}
                icon={'search'}
                value={string}
                placeholder={'Я хочу найти...'}
                testId={'search-input'}
                autoFocus
              />
              <button
                className='absolute z-30 top-0 right-0 overflow-hidden text-indent-full w-[var(--formInputHeight)] h-[var(--formInputHeight)]'
                type={'submit'}
              >
                search
              </button>
            </form>
            <ControlButton icon={'cross'} onClick={() => setIsSearchOpen(false)} />
          </div>

          {value.length > minSearchLength && searchResult && searchResult.length < 1 && !loading ? (
            <div
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                marginBottom: 'var(--lineGap-200)',
              }}
            >
              По вашему запросу ничего не найдено
            </div>
          ) : null}

          <div className='relative overflow-hidden'>
            {loading ? (
              <Spinner
                isNestedAbsolute={Boolean(topShopProducts)}
                isNested={!topShopProducts}
                isTransparent
              />
            ) : null}

            <HeaderSearchResult
              setIsSearchOpen={setIsSearchOpen}
              shopProducts={value.length > minSearchLength ? searchResult || [] : topShopProducts}
              isProductsFound={false}
              string={string}
            />
          </div>
        </Inner>
      </OutsideClickHandler>
    </div>
  );
};

export default HeaderSearch;

import ControlButton from 'components/ControlButton';
import { ROUTE_CATALOGUE, ROUTE_SEARCH_RESULT } from 'config/common';
import { ProductInterface } from 'db/uiInterfaces';
import ProductSnippetGridBigImage from 'layout/snippet/ProductSnippetGridBigImage';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useDebounce } from 'use-debounce';
import Inner from 'components/Inner';
import OutsideClickHandler from 'react-outside-click-handler';
import Input from 'components/FormElements/Input/Input';
import {
  GetCatalogueSearchResultQuery,
  GetCatalogueSearchTopItemsQuery,
  useGetCatalogueSearchResultLazyQuery,
} from 'generated/apolloComponents';
import Spinner from 'components/Spinner';
import RequestError from 'components/RequestError';
import Link from 'components/Link/Link';

type ResultRubrics =
  | GetCatalogueSearchResultQuery['getCatalogueSearchResult']['rubrics']
  | GetCatalogueSearchTopItemsQuery['getCatalogueSearchTopItems']['rubrics'];

type ResultProducts = ProductInterface[];

interface HeaderSearchResultInterface {
  rubrics: ResultRubrics;
  products: ResultProducts;
  setIsSearchOpen: (value: boolean) => void;
  isProductsFound: boolean;
  string: string;
}

const HeaderSearchResult: React.FC<HeaderSearchResultInterface> = ({
  rubrics,
  setIsSearchOpen,
  products,
  isProductsFound,
  string,
}) => {
  return (
    <div className='grid gap-10 grid-cols-1 md:grid-cols-12'>
      <ul className='md:col-span-2'>
        {rubrics.map((rubric) => {
          const { name, slug } = rubric;
          return (
            <li key={slug} data-cy={'search-rubric'}>
              <Link
                onClick={() => setIsSearchOpen(false)}
                href={`${ROUTE_CATALOGUE}/${slug}`}
                testId={`search-rubric-${name}`}
                className='flex items-center min-h-[var(--minLinkHeightSmall)] text-secondary-text hover:no-underline hover:text-theme'
              >
                <span className='overflow-ellipsis whitespace-nowrap'>{name}</span>
              </Link>
            </li>
          );
        })}

        <li>
          {isProductsFound ? (
            <Link
              onClick={() => {
                setIsSearchOpen(false);
              }}
              className='flex items-center min-h-[var(--minLinkHeightSmall)] text-theme'
              href={`${ROUTE_SEARCH_RESULT}/${encodeURIComponent(string)}`}
            >
              <span className='overflow-ellipsis whitespace-nowrap'>Показать все результаты</span>
            </Link>
          ) : null}
        </li>
      </ul>
      <div className='md:col-span-10 grid gap-10 items-stretch md:grid-cols-2 xl:grid-cols-4'>
        {products.map((product) => {
          return (
            <ProductSnippetGridBigImage
              product={product}
              key={`${product._id}`}
              testId={`search-product`}
              className='col-span-1'
            />
          );
        })}
      </div>
    </div>
  );
};

interface HeaderSearchInterface {
  initialData?: GetCatalogueSearchTopItemsQuery | null;
  setIsSearchOpen: (value: boolean) => void;
}

const HeaderSearch: React.FC<HeaderSearchInterface> = ({ initialData, setIsSearchOpen }) => {
  const router = useRouter();
  const [string, setString] = React.useState<string>('');
  const [value] = useDebounce(string, 500);
  const [getSearchResult, { data, loading, error }] = useGetCatalogueSearchResultLazyQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        search: `${value}`,
      },
    },
  });
  const minSearchLength = 2;

  React.useEffect(() => {
    if (value && value.length > minSearchLength) {
      getSearchResult();
    }
  }, [getSearchResult, value]);

  const searchRubrics = data?.getCatalogueSearchResult.rubrics;
  const topRubrics = initialData?.getCatalogueSearchTopItems.rubrics;
  const initialSearchProducts = data?.getCatalogueSearchResult.products as unknown;
  const searchProducts = initialSearchProducts as ProductInterface[];
  const initialTopProducts = initialData?.getCatalogueSearchTopItems.products as unknown;
  const topProducts = initialTopProducts as ProductInterface[];

  const isProductsFound = searchProducts && searchProducts.length > 0;
  const rubrics = searchRubrics && searchRubrics.length > 0 ? searchRubrics : topRubrics;
  const products = isProductsFound ? searchProducts : topProducts;

  return (
    <div
      className='fixed z-[110] inset-0 overflow-y-auto pb-8 bg-primary shadow-lg lg:pb-4 lg:inset-y-auto lg:top-full lg:w-full lg:absolute'
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
                    .push(`${ROUTE_SEARCH_RESULT}/${encodeURIComponent(string)}`)
                    .catch(console.log);
                }
              }}
            >
              <Input
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

          {!loading &&
          value.length > minSearchLength &&
          data?.getCatalogueSearchResult.products &&
          data.getCatalogueSearchResult.products.length < 1 ? (
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
            {loading ? <Spinner isNestedAbsolute isTransparent /> : null}

            {error ? <RequestError /> : null}
            {rubrics && products ? (
              <HeaderSearchResult
                setIsSearchOpen={setIsSearchOpen}
                rubrics={rubrics}
                products={products}
                isProductsFound={isProductsFound}
                string={string}
              />
            ) : null}
          </div>
        </Inner>
      </OutsideClickHandler>
    </div>
  );
};

export default HeaderSearch;

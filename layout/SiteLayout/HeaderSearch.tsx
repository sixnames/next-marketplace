import { ROUTE_CATALOGUE } from 'config/common';
import { ProductInterface } from 'db/uiInterfaces';
import * as React from 'react';
import { useDebounce } from 'use-debounce';
import Inner from 'components/Inner/Inner';
import OutsideClickHandler from 'react-outside-click-handler';
import Icon from 'components/Icon/Icon';
import Input from 'components/FormElements/Input/Input';
import {
  GetCatalogueSearchResultQuery,
  GetCatalogueSearchTopItemsQuery,
  useGetCatalogueSearchResultLazyQuery,
} from 'generated/apolloComponents';
import Spinner from 'components/Spinner/Spinner';
import RequestError from 'components/RequestError/RequestError';
import Link from 'components/Link/Link';
import ProductSnippetGrid from 'components/Product/ProductSnippet/ProductSnippetGrid';

type ResultRubrics =
  | GetCatalogueSearchResultQuery['getCatalogueSearchResult']['rubrics']
  | GetCatalogueSearchTopItemsQuery['getCatalogueSearchTopItems']['rubrics'];

type ResultProducts = ProductInterface[];

interface HeaderSearchResultInterface {
  rubrics: ResultRubrics;
  products: ResultProducts;
  setIsSearchOpen: (value: boolean) => void;
}

const HeaderSearchResult: React.FC<HeaderSearchResultInterface> = ({
  rubrics,
  setIsSearchOpen,
  products,
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
      </ul>
      <div className='md:col-span-10 grid gap-10 items-stretch md:grid-cols-2 xl:grid-cols-3'>
        {products.map((product) => {
          return (
            <ProductSnippetGrid
              product={product}
              key={`${product._id}`}
              testId={`search-product`}
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
  const [string, setString] = React.useState<string>('');
  const [value] = useDebounce(string, 1000);
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

  const rubrics = searchRubrics && searchRubrics.length ? searchRubrics : topRubrics;
  const products = searchProducts && searchProducts.length ? searchProducts : topProducts;

  return (
    <div
      className='fixed z-[110] inset-0 overflow-y-auto pb-[var(--mobileNavHeight)] bg-primary shadow-lg lg:inset-y-auto lg:top-full lg:w-full lg:absolute'
      data-cy={'search-dropdown'}
    >
      <OutsideClickHandler onOutsideClick={() => setIsSearchOpen(false)}>
        <Inner>
          <div className='flex items-center justify-end pt-8 min-h-8 mb-8 text-xl font-medium lg:hidden'>
            <div className='search-mobile-title overflow-ellipsis overflow-hidden whitespace-nowrap text-center'>
              Поиск
            </div>
            <div
              className='flex items-center justify-end h-[var(--formInputHeightSmall)] w-[var(--formInputHeightSmall)] text-secondary-text'
              onClick={() => setIsSearchOpen(false)}
            >
              <Icon className='w-5 h-5' name={'cross'} />
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              onChange={(e) => setString(e.target.value)}
              name={'search'}
              icon={'search'}
              value={string}
              placeholder={'Я хочу найти...'}
              testId={'search-input'}
            />
          </form>

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
              />
            ) : null}
          </div>
        </Inner>
      </OutsideClickHandler>
    </div>
  );
};

export default HeaderSearch;

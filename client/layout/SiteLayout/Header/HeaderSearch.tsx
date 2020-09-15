import React, { useEffect, useState } from 'react';
import classes from './HeaderSearch.module.css';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from '../../../context/siteContext';
import OutsideClickHandler from 'react-outside-click-handler';
import Button from '../../../components/Buttons/Button';
import useIsMobile from '../../../hooks/useIsMobile';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/FormElements/Input/Input';
import {
  GetCatalogueSearchResultQuery,
  GetCatalogueSearchTopItemsQuery,
  useGetCatalogueSearchResultLazyQuery,
  useGetCatalogueSearchTopItemsLazyQuery,
} from '../../../generated/apolloComponents';
import { debounce } from 'lodash';
import Spinner from '../../../components/Spinner/Spinner';
import RequestError from '../../../components/RequestError/RequestError';
import Link from '../../../components/Link/Link';
import ProductSnippetGrid from '../../../components/ProductSnippet/ProductSnippetGrid';

type ResultRubrics =
  | GetCatalogueSearchResultQuery['getCatalogueSearchResult']['rubrics']
  | GetCatalogueSearchTopItemsQuery['getCatalogueSearchTopItems']['rubrics'];

type ResultProducts =
  | GetCatalogueSearchResultQuery['getCatalogueSearchResult']['products']
  | GetCatalogueSearchTopItemsQuery['getCatalogueSearchTopItems']['products'];

interface HeaderSearchResultInterface {
  rubrics: ResultRubrics;
  products: ResultProducts;
}

const HeaderSearchResult: React.FC<HeaderSearchResultInterface> = ({ rubrics, products }) => {
  const { hideSearchDropdown } = useSiteContext();
  return (
    <div className={classes.result}>
      <ul>
        {rubrics.map((rubric) => {
          const { nameString, slug } = rubric;
          return (
            <li key={slug} data-cy={'search-rubric'}>
              <Link
                onClick={hideSearchDropdown}
                href={{
                  pathname: `/[...catalogue]`,
                }}
                as={{
                  pathname: `/${slug}`,
                }}
                testId={`search-rubric-${nameString}`}
                className={`${classes.rubric}`}
              >
                <span>{nameString}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className={classes.resultList}>
        {products.map((product) => {
          return (
            <ProductSnippetGrid product={product} key={product.id} testId={'search-product'} />
          );
        })}
      </div>
    </div>
  );
};

const HeaderSearch: React.FC = () => {
  const { hideSearchDropdown } = useSiteContext();
  const [search, setSearch] = useState<string>('');
  const isMobile = useIsMobile();
  const [getTopResults, { data, loading, error }] = useGetCatalogueSearchTopItemsLazyQuery();
  const [
    getSearchResult,
    { data: searchData, loading: searchLoading, error: searchError },
  ] = useGetCatalogueSearchResultLazyQuery({
    variables: {
      search,
    },
  });
  const minSearchLength = 2;

  useEffect(() => {
    return () => {
      setSearch('');
    };
  }, []);

  useEffect(() => {
    if (search && search.length > minSearchLength) {
      debounce(getSearchResult, 500)();
    }
  }, [getSearchResult, search]);

  useEffect(() => {
    getTopResults();
  }, [getTopResults]);

  function setSearchHandler(value: string) {
    setSearch(value);
  }

  const isLoading = loading || searchLoading;
  const isError = error || searchError;

  const searchRubrics = searchData?.getCatalogueSearchResult.rubrics;
  const topRubrics = data?.getCatalogueSearchTopItems.rubrics;
  const searchProducts = searchData?.getCatalogueSearchResult.products;
  const topProducts = data?.getCatalogueSearchTopItems.products;

  const rubrics = searchRubrics && searchRubrics.length ? searchRubrics : topRubrics;
  const products = searchProducts && searchProducts.length ? searchProducts : topProducts;

  return (
    <div className={classes.frame} data-cy={'search-dropdown'}>
      <OutsideClickHandler onOutsideClick={hideSearchDropdown}>
        <Inner>
          {isMobile ? (
            <div className={classes.frameTitle}>
              <div className={classes.frameTitleName}>Поиск</div>
              <div className={classes.frameTitleClose} onClick={hideSearchDropdown}>
                <Icon name={'cross'} />
              </div>
            </div>
          ) : null}

          <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
            <Input
              onChange={(e) => setSearchHandler(e.target.value)}
              name={'search'}
              icon={'search'}
              value={search}
              placeholder={'Я хочу найти...'}
              testId={'search-input'}
            />
            <Button
              type={'submit'}
              icon={isMobile ? 'arrow-right' : undefined}
              theme={isMobile ? 'secondary' : 'primary'}
              short={isMobile}
            >
              {isMobile ? null : 'Искать'}
            </Button>
            {isMobile ? <Button icon={'scan'} theme={'secondary'} short /> : null}
            {isMobile ? null : (
              <Button
                icon={'cross'}
                theme={'secondary'}
                onClick={hideSearchDropdown}
                testId={'search-close'}
                short
              />
            )}
          </form>
          <div className={classes.searchFrame}>
            {isLoading ? <Spinner className={classes.spinner} /> : null}
            {isError ? <RequestError /> : null}
            {rubrics && products ? (
              <HeaderSearchResult rubrics={rubrics} products={products} />
            ) : null}
          </div>
        </Inner>
      </OutsideClickHandler>
    </div>
  );
};

export default HeaderSearch;

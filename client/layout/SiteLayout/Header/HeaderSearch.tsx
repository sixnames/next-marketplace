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

interface HeaderSearchResultInterface {
  result:
    | GetCatalogueSearchResultQuery['getCatalogueSearchResult']
    | GetCatalogueSearchTopItemsQuery['getCatalogueSearchTopItems'];
}

const HeaderSearchResult: React.FC<HeaderSearchResultInterface> = ({ result }) => {
  console.log(result);
  return (
    <div className={classes.result}>
      <div>rubric</div>
      <div className={classes.resultList}>products</div>
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
  const result = searchData?.getCatalogueSearchResult || data?.getCatalogueSearchTopItems;

  return (
    <div className={classes.frame}>
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
              <Button icon={'cross'} theme={'secondary'} onClick={hideSearchDropdown} short />
            )}
          </form>
          <div>
            {isLoading ? <Spinner isNested /> : null}
            {isError ? <RequestError /> : null}
            {result ? <HeaderSearchResult result={result} /> : null}
          </div>
        </Inner>
      </OutsideClickHandler>
    </div>
  );
};

export default HeaderSearch;

import React from 'react';
import HeaderSearchItem from './HeaderSearchItem';
import classes from './HeaderSearchResult.module.css';
import AnimateOpacity from '../../../components/AnimateOpacity/AnimateOpacity';
import Spinner from '../../../components/Spinner/Spinner';
import Backdrop from '../../../components/Backdrop/Backdrop';

interface HeaderSearchResultInterface {
  query: string;
  clearSearch: () => void;
}

const HeaderSearchResult: React.FC<HeaderSearchResultInterface> = ({ query = '', clearSearch }) => {
  const { data, loading, error } = {
    loading: false,
    error: false,
    data: {
      getPagedProducts: {
        docs: [],
      },
    },
  };

  const emptyResult = (
    <AnimateOpacity className={classes.frame}>
      <div className={`${classes.list} ${classes.empty} `}>
        По запросу {'"'}
        {query}
        {'"'} ничего не найдено.
      </div>
      <Backdrop onClick={clearSearch} />
    </AnimateOpacity>
  );

  if (loading) {
    return (
      <AnimateOpacity className={classes.frame}>
        <div className={classes.list}>
          <Spinner isNested />
        </div>
      </AnimateOpacity>
    );
  }

  if (error) {
    return emptyResult;
  }

  const { getPagedProducts } = data;
  const { docs: productsResult } = getPagedProducts;

  const isEmpty = !productsResult.length;
  if (isEmpty) {
    return emptyResult;
  }

  return (
    <AnimateOpacity className={classes.frame}>
      <div className={classes.list}>
        {productsResult && productsResult.length ? (
          <div className={classes.section}>
            <div className={classes.sectionTitle}>Товары</div>
            {productsResult.map((product, i) => (
              <HeaderSearchItem key={i} product={product} />
            ))}
          </div>
        ) : null}
      </div>

      <Backdrop onClick={clearSearch} />
    </AnimateOpacity>
  );
};

export default HeaderSearchResult;

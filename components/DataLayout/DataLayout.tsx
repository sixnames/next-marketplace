import Head from 'next/head';
import * as React from 'react';
import Title from '../Title/Title';
import DataLayoutFilterTrigger from './DataLayoutFilterTrigger';
import MoreNav from '../MoreNav/MoreNav';
import Inner from '../Inner/Inner';
import DataLayoutFilter from './DataLayoutFilter';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import classes from './DataLayout.module.css';
import ContentItemControls, {
  ContentItemControlsInterface,
} from '../ContentItemControls/ContentItemControls';
import { ParsedUrlQuery } from 'querystring';
import { NavItemInterface } from 'types/clientTypes';

export interface FilterResultArgsInterface {
  query: ParsedUrlQuery;
  isFilterVisible: boolean;
  toggleFilter: () => void;
}

interface DataLayoutInterface {
  title: string;
  filterContent?: React.ReactNode;
  contentControlsConfig?: ContentItemControlsInterface | null;
  filterResult: (args: FilterResultArgsInterface) => any;
  filterResultNavConfig?: NavItemInterface[] | null;
  isFilterVisible?: boolean;
}

const DataLayout: React.FC<DataLayoutInterface> = ({
  title = '',
  filterContent,
  filterResult,
  filterResultNavConfig,
  contentControlsConfig,
  isFilterVisible,
}) => {
  const [filterVisible, setFilterVisible] = React.useState<boolean>(() => Boolean(isFilterVisible));
  const { query } = useDataLayoutMethods();

  const noContentControls = !filterContent && !filterResultNavConfig && !contentControlsConfig;

  const toggleFilter = React.useCallback(() => {
    setFilterVisible((prevState) => !prevState);
  }, []);

  return (
    <div className={classes.dataLayout}>
      {title ? (
        <React.Fragment>
          <Head>
            <title>{title}</title>
          </Head>

          <Title light>{title}</Title>
        </React.Fragment>
      ) : null}

      <Inner className={classes.Inner} wide lowTop>
        {filterContent && (
          <DataLayoutFilter
            isFilterVisible={filterVisible}
            toggleFilter={toggleFilter}
            filterContent={filterContent}
          />
        )}

        <div className={classes.Content}>
          <div className={`${classes.Controls} ${noContentControls ? classes.NoControls : ''}`}>
            <div className={classes.ControlsLeft}>
              {filterContent ? (
                <DataLayoutFilterTrigger
                  isFilterVisible={filterVisible}
                  toggleFilter={toggleFilter}
                />
              ) : null}
            </div>

            {contentControlsConfig && (
              <div>
                <ContentItemControls {...contentControlsConfig} />
              </div>
            )}

            {filterResultNavConfig && (
              <div>
                <MoreNav
                  navConfig={filterResultNavConfig}
                  className={classes.MoreNav}
                  isTab={true}
                />
              </div>
            )}
          </div>

          {filterResult({ query, isFilterVisible: filterVisible, toggleFilter })}
        </div>
      </Inner>
    </div>
  );
};

export default DataLayout;

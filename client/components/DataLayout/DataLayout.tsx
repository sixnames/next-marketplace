import React, { ReactNode } from 'react';
import Title from '../Title/Title';
import DataLayoutFilterTrigger from './DataLayoutFilterTrigger';
import MoreNav from '../MoreNav/MoreNav';
import DataLayoutPreview from './DataLayoutPreview';
import Inner from '../Inner/Inner';
import DataLayoutFilter from './DataLayoutFilter';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import classes from './DataLayout.module.css';
import { NavItemInterface, ObjectType } from '../../types';
import ContentItemControls, {
  ContentItemControlsInterface,
} from '../ContentItemControls/ContentItemControls';

interface DataLayoutInterface {
  title: string;
  filterContent?: ReactNode;
  contentControlsConfig?: ContentItemControlsInterface | null;
  filterResult: any;
  filterResultNavConfig?: NavItemInterface[] | null;
  preview?: any;
}

export interface FilterResultArgsInterface {
  query: ObjectType;
}

const DataLayout: React.FC<DataLayoutInterface> = ({
  title = '',
  filterContent,
  filterResult,
  preview,
  filterResultNavConfig,
  contentControlsConfig,
}) => {
  const { query } = useDataLayoutMethods();

  const noContentControls = !filterContent && !filterResultNavConfig && !contentControlsConfig;

  return (
    <div className={classes.Frame}>
      <Title light>{title}</Title>

      <Inner className={classes.Inner} wide lowTop>
        {filterContent && <DataLayoutFilter filterContent={filterContent} />}

        <div className={classes.Content}>
          <div className={`${classes.Controls} ${noContentControls ? classes.NoControls : ''}`}>
            <div className={classes.ControlsLeft}>
              {filterContent && <DataLayoutFilterTrigger />}
            </div>

            {contentControlsConfig && (
              <div className={classes.ControlsRight}>
                <ContentItemControls {...contentControlsConfig} />
              </div>
            )}

            {filterResultNavConfig && (
              <div className={classes.ControlsRight}>
                <MoreNav navConfig={filterResultNavConfig} className={classes.MoreNav} />
              </div>
            )}
          </div>

          {filterResult({ query })}
        </div>

        {preview && <DataLayoutPreview preview={preview} />}
      </Inner>
    </div>
  );
};

export default DataLayout;

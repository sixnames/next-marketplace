import React, { useCallback, useMemo } from 'react';
import { get } from 'lodash';
import RequestError from '../RequestError/RequestError';
import classes from './Table.module.css';

export interface RenderArgs<T> {
  cellData: any;
  dataItem: T;
  cellIndex: number;
  rowIndex: number;
}

export interface TableColumn<T> {
  key?: string;
  fix?: boolean;
  style?: React.CSSProperties;
  colSpan?: number;
  sortBy?: string;
  title?: any;
  hidden?: boolean;
  textAlign?: 'right' | 'left' | 'center';
  render?: (args: RenderArgs<T>) => any;
  hide?: (args: RenderArgs<T>) => boolean;
  tHeadAlign?: 'flex-start' | 'flex-end';
}

type TableInterface<T> = {
  data?: T[] | null;
  columns: TableColumn<T>[];
  footerData?: any[];
  footerColumns?: any[];
  sortData?: (sortBy: string) => void;
  onRowClick?: (dataItem: T) => void;
  className?: string;
  fixPosition?: number;
  emptyMessage?: string;
  testIdKey?: string;
  testId?: string;
};

const Table = <T extends Record<string, any>>({
  data,
  footerData = [],
  columns = [],
  footerColumns = [],
  sortData,
  onRowClick,
  className,
  fixPosition = 0,
  emptyMessage = 'Нет данных',
  testIdKey = '',
  testId,
}: TableInterface<T>) => {
  const fixedStyle: React.CSSProperties = useMemo(() => {
    return {
      transform: fixPosition ? `translateY(${fixPosition}px)` : `translateY(0px)`,
      backgroundColor: fixPosition ? 'var(--gray)' : undefined,
      color: fixPosition ? 'white' : undefined,
    };
  }, [fixPosition]);

  const tHead = columns.map(({ title, sortBy, fix, style, hidden }) => ({
    title,
    sortBy,
    fix,
    style,
    hidden,
  }));

  const renderColumns = useCallback(
    (columns: TableColumn<T>[], data: T[]) => {
      return data.map((dataItem, rowIndex: number) => {
        const { hidden, id, isWarning = false } = dataItem;
        const testId = dataItem[testIdKey];
        const key = id || rowIndex;
        if (hidden) return null;

        return (
          <tr
            onClick={() => onRowClick && onRowClick(dataItem)}
            key={key}
            data-cy={testId}
            className={`${classes.row} ${isWarning ? classes.rowWarning : ''}`}
          >
            {columns.map((cell, cellIndex) => {
              const { key = '', render, style, colSpan, hidden } = cell;
              const cellData = key ? get(dataItem, key) : null;

              if (hidden) {
                return null;
              }

              return (
                <td colSpan={colSpan} key={key + cellIndex} className={classes.cell} style={style}>
                  {render && render({ cellData, dataItem, cellIndex, rowIndex })}
                </td>
              );
            })}
          </tr>
        );
      });
    },
    // eslint-disable-next-line
    [onRowClick, testIdKey],
  );

  const renderTableBody = useMemo(() => {
    if (!data) {
      return null;
    }
    return renderColumns(columns, data);
  }, [data, columns, renderColumns]);

  const renderTableFooter = useMemo(() => {
    return renderColumns(footerColumns, footerData);
  }, [footerData, footerColumns, renderColumns]);

  if ((data && data.length < 1) || !data) {
    return <RequestError message={emptyMessage} />;
  }

  return (
    <table className={className || ''} data-cy={testId}>
      <thead>
        <tr className={classes.row}>
          {tHead.map(({ title = '', sortBy, style, hidden }, i) => {
            if (hidden) {
              return null;
            }

            return (
              <th
                className={classes.headCell}
                onClick={() => !!sortData && !!sortBy && sortData(sortBy)}
                key={title + i}
              >
                <div style={{ ...style, ...fixedStyle }} className={classes.fixedCell}>
                  {!!title && title}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {renderTableBody}

        {!!footerColumns.length && (
          <tr className={`${classes.row} ${classes.rowGap}`}>
            <td colSpan={columns.length} className={classes.cell} />
          </tr>
        )}
      </tbody>

      {!!footerColumns.length && <tfoot>{renderTableFooter}</tfoot>}
    </table>
  );
};

export default Table;

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
  accessor?: keyof T;
  cellStyle?: React.CSSProperties;
  colSpan?: number;
  sortBy?: string;
  headTitle?: any;
  isHidden?: boolean;
  render?: (args: RenderArgs<T>) => any;
  hide?: (args: RenderArgs<T>) => boolean;
}

type TableInterface<T> = {
  data?: T[] | null;
  columns: TableColumn<T>[];
  footerData?: any[];
  footerColumns?: any[];
  sortHandler?: (sortBy: string) => void;
  onRowClick?: (dataItem: T) => void;
  className?: string;
  fixPosition?: number;
  emptyMessage?: string;
  testIdKey?: keyof T;
  tableTestId?: string;
};

const Table = <T extends Record<string, any>>({
  data,
  footerData = [],
  columns = [],
  footerColumns = [],
  sortHandler,
  onRowClick,
  className,
  fixPosition = 0,
  emptyMessage = 'Нет данных',
  testIdKey = '',
  tableTestId,
}: TableInterface<T>) => {
  const fixedStyle: React.CSSProperties = useMemo(() => {
    return {
      transform: fixPosition ? `translateY(${fixPosition}px)` : `translateY(0px)`,
      backgroundColor: fixPosition ? 'var(--gray)' : undefined,
      color: fixPosition ? 'white' : undefined,
    };
  }, [fixPosition]);

  const tHead = columns.map(({ headTitle, sortBy, cellStyle, isHidden }) => ({
    headTitle: headTitle,
    sortBy,
    cellStyle,
    isHidden: isHidden,
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
              const { accessor, render, cellStyle, colSpan, isHidden } = cell;
              const cellData = accessor ? get(dataItem, accessor) : null;

              if (isHidden) {
                return null;
              }

              return (
                <td
                  colSpan={colSpan}
                  key={`${accessor}${cellIndex}`}
                  className={classes.cell}
                  style={cellStyle}
                >
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
    <table className={className || ''} data-cy={tableTestId}>
      <thead>
        <tr className={classes.row}>
          {tHead.map(({ headTitle, sortBy, cellStyle, isHidden }, i) => {
            if (isHidden) {
              return null;
            }

            return (
              <th
                className={classes.headCell}
                onClick={() => !!sortHandler && !!sortBy && sortHandler(sortBy)}
                key={`${headTitle}${i}`}
              >
                <div style={{ ...cellStyle, ...fixedStyle }} className={classes.fixedCell}>
                  {headTitle}
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

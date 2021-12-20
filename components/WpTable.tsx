import * as React from 'react';
import { get } from 'lodash';
import RequestError from './RequestError';

export interface RenderArgs<T> {
  cellData: any;
  dataItem: T;
  cellIndex: number;
  rowIndex: number;
}

export interface WpTableColumn<T> {
  accessor?: string;
  cellStyle?: React.CSSProperties;
  colSpan?: number;
  sortBy?: string;
  headTitle?: any;
  isHidden?: boolean;
  render?: (args: RenderArgs<T>) => any;
  hide?: (args: RenderArgs<T>) => boolean;
}

type WpTableInterface<T> = {
  data?: T[] | null;
  columns: WpTableColumn<T>[];
  footerData?: any[];
  footerColumns?: any[];
  sortHandler?: (sortBy: string) => void;
  onRowClick?: (dataItem: T) => void;
  onRowDoubleClick?: (dataItem: T) => void;
  className?: string;
  emptyMessage?: string;
  testIdKey?: string;
  tableTestId?: string;
};

const cellClassName = 'z-10 align-middle h-8 py-2 px-4 text-left border border-gray-500';
const rowClassName = 'transition transition-duration-150';

const WpTable = <T extends Record<string, any>>({
  data,
  footerData = [],
  columns = [],
  footerColumns = [],
  sortHandler,
  onRowClick,
  onRowDoubleClick,
  className,
  emptyMessage = 'Список пуст',
  testIdKey = '',
  tableTestId,
}: WpTableInterface<T>) => {
  const tHead = columns.map(({ headTitle, sortBy, cellStyle, isHidden }) => ({
    headTitle: headTitle,
    sortBy,
    cellStyle,
    isHidden: isHidden,
  }));

  const renderColumns = React.useCallback(
    (columns: WpTableColumn<T>[], data: T[]) => {
      return data.map((dataItem, rowIndex: number) => {
        const { hidden, _id, isWarning = false } = dataItem;
        const testId = get(dataItem, testIdKey);
        const key = _id || rowIndex;
        if (hidden) {
          return null;
        }

        return (
          <tr
            onClick={() => (onRowClick ? onRowClick(dataItem) : null)}
            onDoubleClick={() => (onRowDoubleClick ? onRowDoubleClick(dataItem) : null)}
            key={key}
            data-cy={`${tableTestId ? `${tableTestId}-` : ''}${testId || rowIndex}-row`}
            className={`${rowClassName} ${
              isWarning ? 'bg-red-500 bg-opacity-20' : 'bg-primary hover:bg-secondary'
            }`}
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
                  className={cellClassName}
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

  const renderTableBody = React.useMemo(() => {
    if (!data) {
      return null;
    }
    return renderColumns(columns, data);
  }, [data, columns, renderColumns]);

  const renderTableFooter = React.useMemo(() => {
    return renderColumns(footerColumns, footerData);
  }, [footerData, footerColumns, renderColumns]);

  if ((data && data.length < 1) || !data) {
    return <RequestError message={emptyMessage} />;
  }

  return (
    <table className={`relative ${className ? className : ''}`} data-cy={tableTestId}>
      <thead>
        <tr className={`${rowClassName} bg-primary`}>
          {tHead.map(({ headTitle, sortBy, isHidden }, i) => {
            if (isHidden) {
              return null;
            }

            return (
              <th
                className={`${cellClassName} bg-secondary`}
                onClick={() => !!sortHandler && !!sortBy && sortHandler(sortBy)}
                key={`${headTitle}${i}`}
              >
                {headTitle}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {renderTableBody}

        {footerColumns.length > 0 ? (
          <tr className={`${rowClassName}`}>
            <td colSpan={columns.length} className='h-4' />
          </tr>
        ) : null}
      </tbody>

      {footerColumns.length > 0 ? <tfoot>{renderTableFooter}</tfoot> : null}
    </table>
  );
};

export default WpTable;

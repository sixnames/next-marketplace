import React, { useCallback, useMemo } from 'react';
import { get } from 'lodash';
import RequestError from '../RequestError/RequestError';
import classes from './Table.module.css';

export interface TableColumn {
  key?: string;
  fix?: boolean;
  style?: any;
  colSpan?: number;
  render?: (cellData: any, dataItem: any, index: number) => any;
  sortBy?: string;
  title?: string;
  hidden?: boolean;
}

interface TableInterface {
  data?: any[] | null;
  columns: TableColumn[];
  footerData?: any[];
  footerColumns?: any[];
  sortData?: (sortBy: string) => void;
  onRowClick?: (dataItem: any) => void;
  className?: string;
  fixPosition?: string;
  emptyMessage?: string;
  testIdKey?: string;
}

const Table: React.FC<TableInterface> = ({
  data = [],
  footerData = [],
  columns = [],
  footerColumns = [],
  sortData,
  onRowClick,
  className,
  fixPosition = 0,
  emptyMessage = 'Нет данных',
  testIdKey = '',
}) => {
  const fixedStyle = {
    transform: fixPosition ? `translateY(${fixPosition}px)` : `translateY(0px)`,
    backgroundColor: fixPosition ? 'var(--gray)' : null,
    color: fixPosition ? 'white' : null,
  };

  const tHead = columns.map(({ title, sortBy, fix, style, hidden }) => ({
    title,
    sortBy,
    fix,
    style,
    hidden,
  }));

  const renderColumns = useCallback(
    (columns, data) => {
      return data.map((dataItem: any, i: number) => {
        const { hidden, id, isWarning = false } = dataItem;
        const testId = dataItem[testIdKey];
        const key = id ? id : i;
        if (hidden) return null;

        return (
          <tr
            onClick={() => onRowClick && onRowClick(dataItem)}
            key={key}
            data-cy={testId}
            className={`${classes.row} ${isWarning ? classes.rowWarning : ''}`}
          >
            {columns.map((cell: TableColumn, cellIndex: number) => {
              const { key = '', render, style, colSpan, hidden } = cell;
              const cellData = key ? get(dataItem, key) : null;

              if (hidden) {
                return null;
              }

              return (
                <td
                  colSpan={colSpan}
                  key={key + cellIndex}
                  className={classes.cell}
                  style={{
                    ...style,
                  }}
                >
                  {render && render(cellData, dataItem, cellIndex)}
                </td>
              );
            })}
          </tr>
        );
      });
    },
    [onRowClick, testIdKey],
  );

  const renderTableBody = useMemo(() => {
    return renderColumns(columns, data);
  }, [data, columns, renderColumns]);

  const renderTableFooter = useMemo(() => {
    return renderColumns(footerColumns, footerData);
  }, [footerData, footerColumns, renderColumns]);

  if ((data && data.length < 1) || !data) {
    return <RequestError message={emptyMessage} />;
  }

  return (
    <table className={className || ''}>
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

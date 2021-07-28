import { noNaN } from 'lib/numbers';
import * as React from 'react';
import { useLocaleContext } from 'context/localeContext';
import { getCurrencyString } from 'lib/i18n';
import NumberFormat from 'react-number-format';

interface CurrencyInterface {
  value?: string | number | null;
  className?: string;
  valueClassName?: string;
  testId?: string;
  noZeroValue?: boolean;
}

const Currency: React.FC<CurrencyInterface> = ({
  value,
  noZeroValue,
  className,
  valueClassName,
  testId,
}) => {
  const { currency } = useLocaleContext();
  const finalValue = typeof value === 'number' ? getCurrencyString(value) : value;

  if (noZeroValue && (!finalValue || finalValue === '0')) {
    return null;
  }

  return (
    <span className={`inline-flex whitespace-nowrap items-baseline ${className ? className : ''}`}>
      <NumberFormat
        value={noNaN(value)}
        thousandSeparator={true}
        displayType={'text'}
        renderText={(value: string) => {
          return (
            <div
              data-cy={testId}
              data-price-value={value}
              className={`mr-[0.35rem] ${valueClassName ? valueClassName : ''}`}
            >
              {value.replace(/,/g, ' ')}
            </div>
          );
        }}
      />
      <span className={'font-normal text-secondary-text text-[0.75em]'}>{currency}</span>
    </span>
  );
};

export default Currency;

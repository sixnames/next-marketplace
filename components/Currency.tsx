import * as React from 'react';
import NumberFormat from 'react-number-format';
import { useLocaleContext } from '../context/localeContext';
import { noNaN } from '../lib/numbers';

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
  const castedPrice = `${value}`.replace(/\s/g, '');
  const finalValue = noNaN(castedPrice);

  if (noZeroValue && finalValue === 0) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-baseline gap-1 whitespace-nowrap ${className ? className : ''}`}
    >
      <NumberFormat
        value={finalValue}
        thousandSeparator={true}
        displayType={'text'}
        renderText={(value: string) => {
          return (
            <span
              data-cy={testId}
              data-price-value={value}
              className={`${valueClassName ? valueClassName : ''}`}
            >
              {value.replace(/,/g, ' ')}
            </span>
          );
        }}
      />
      <span className={'text-[0.75em] font-normal text-secondary-text'}>{currency}</span>
    </span>
  );
};

export default Currency;

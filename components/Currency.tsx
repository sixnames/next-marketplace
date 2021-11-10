import { noNaN } from 'lib/numbers';
import * as React from 'react';
import { useLocaleContext } from 'context/localeContext';
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
  const castedPrice = `${value}`.replace(/\s/g, '');
  const finalValue = noNaN(castedPrice);

  if (noZeroValue && finalValue === 0) {
    return null;
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap items-baseline gap-1 ${className ? className : ''}`}
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
      <span className={'font-normal text-secondary-text text-[0.75em]'}>{currency}</span>
    </span>
  );
};

export default Currency;

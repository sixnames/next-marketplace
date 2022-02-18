import { formatDateTime } from 'lib/dateFormatUtils';
import * as React from 'react';
import { useLocaleContext } from './context/localeContext';

interface FormattedDateTimeInterface {
  value?: string | Date | null;
  className?: string;
}

const FormattedDateTime: React.FC<FormattedDateTimeInterface> = ({ value, className }) => {
  const { locale } = useLocaleContext();
  const dateClass = `whitespace-nowrap ${className ? className : ''}`;
  const fallback = <span className={dateClass}>--</span>;

  if (!value) {
    return <span className={dateClass}>{fallback}</span>;
  }

  const payload = formatDateTime({ value, locale });
  if (!payload) {
    return fallback;
  }

  return <span className={dateClass}>{payload}</span>;
};

export default FormattedDateTime;

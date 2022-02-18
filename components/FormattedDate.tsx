import { formatDate } from 'lib/dateFormatUtils';
import * as React from 'react';
import { useLocaleContext } from './context/localeContext';

interface FormattedDateInterface {
  value?: string | Date | null;
  className?: string;
}

const FormattedDate: React.FC<FormattedDateInterface> = ({ value, className }) => {
  const { locale } = useLocaleContext();
  const dateClass = `whitespace-nowrap ${className ? className : ''}`;
  const fallback = <span className={dateClass}>--</span>;

  if (!value) {
    return fallback;
  }

  const payload = formatDate({ value, locale });
  if (!payload) {
    return fallback;
  }

  return <span className={dateClass}>{payload}</span>;
};

export default FormattedDate;

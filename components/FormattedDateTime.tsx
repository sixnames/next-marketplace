import * as React from 'react';
import { useLocaleContext } from 'context/localeContext';

interface FormattedDateTimeInterface {
  value?: string | Date | null;
  className?: string;
}

const FormattedDateTime: React.FC<FormattedDateTimeInterface> = ({ value, className }) => {
  const { locale } = useLocaleContext();
  const dateClass = `whitespace-nowrap ${className ? className : ''}`;
  const fallback = <span className={dateClass}>--</span>;

  if (!value) {
    return fallback;
  }

  try {
    const date = new Date(value);
    const formattedDate = Intl.DateTimeFormat(locale, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: false,
    }).format(date);

    return <span className={dateClass}>{formattedDate}</span>;
  } catch {
    return fallback;
  }
};

export default FormattedDateTime;

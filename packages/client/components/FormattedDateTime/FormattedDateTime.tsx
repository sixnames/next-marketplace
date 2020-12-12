import React from 'react';
import classes from './FormattedDate.module.css';
import { useLanguageContext } from '../../context/languageContext';

interface FormattedDateTimeInterface {
  value?: string | Date | null;
  className?: string;
}

const FormattedDateTime: React.FC<FormattedDateTimeInterface> = ({ value, className }) => {
  const { lang } = useLanguageContext();
  const dateClass = `${classes.frame} ${className ? className : ''}`;
  const fallback = <span className={dateClass}>--</span>;

  if (!value) {
    return fallback;
  }

  try {
    const date = new Date(value);
    const formattedDate = Intl.DateTimeFormat(lang, {
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

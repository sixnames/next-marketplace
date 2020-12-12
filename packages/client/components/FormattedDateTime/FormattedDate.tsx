import React from 'react';
import classes from './FormattedDate.module.css';
import { useLanguageContext } from '../../context/languageContext';

interface FormattedDateInterface {
  value?: string | Date | null;
  className?: string;
}

const FormattedDate: React.FC<FormattedDateInterface> = ({ value, className }) => {
  const { lang } = useLanguageContext();

  if (!value) {
    return <span className={`${classes.frame} ${className ? className : ''}`}>--</span>;
  }

  try {
    const date = new Date(value);
    const formattedDate = Intl.DateTimeFormat(lang, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dateStyle: 'short',
    }).format(date);

    return (
      <span className={`${classes.frame} ${className ? className : ''}`}>{formattedDate}</span>
    );
  } catch {
    return <span className={`${classes.frame} ${className ? className : ''}`}>--</span>;
  }
};

export default FormattedDate;

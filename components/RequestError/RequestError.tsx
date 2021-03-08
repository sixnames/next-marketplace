import { getFieldTranslation } from 'config/constantTranslations';
import { useRouter } from 'next/router';
import * as React from 'react';
import classes from './RequestError.module.css';

interface RequestErrorInterface {
  message?: string;
}

const RequestError: React.FC<RequestErrorInterface> = ({ message }) => {
  const { locale } = useRouter();
  const defaultErrorMessage = React.useMemo(() => {
    return getFieldTranslation(`messages.dataError.${locale}`);
  }, [locale]);
  return <div className={classes.frame}>{message || defaultErrorMessage}</div>;
};

export default RequestError;

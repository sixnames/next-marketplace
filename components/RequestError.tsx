import { useRouter } from 'next/router';
import * as React from 'react';
import { getConstantTranslation } from '../config/constantTranslations';

interface RequestErrorInterface {
  message?: string;
}

const RequestError: React.FC<RequestErrorInterface> = ({ message }) => {
  const { locale } = useRouter();
  const defaultErrorMessage = React.useMemo(() => {
    return getConstantTranslation(`messages.dataError.${locale}`);
  }, [locale]);
  return (
    <div className='py-12 px-4 text-center text-xl font-medium text-red-500'>
      {message || defaultErrorMessage}
    </div>
  );
};

export default RequestError;

import { getConstantTranslation } from 'config/constantTranslations';
import { useRouter } from 'next/router';
import * as React from 'react';

interface RequestErrorInterface {
  message?: string;
}

const RequestError: React.FC<RequestErrorInterface> = ({ message }) => {
  const { locale } = useRouter();
  const defaultErrorMessage = React.useMemo(() => {
    return getConstantTranslation(`messages.dataError.${locale}`);
  }, [locale]);
  return (
    <div className='py-12 px-4 text-xl font-medium text-center text-wp-error'>
      {message || defaultErrorMessage}
    </div>
  );
};

export default RequestError;

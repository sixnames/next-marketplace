import * as React from 'react';
import { useRouter } from 'next/router';
import Icon from '../Icon/Icon';

const BackLink: React.FC = () => {
  const router = useRouter();

  return (
    <a
      href={'#'}
      className='inline-flex items-center text-primary-text hover:text-link-text hover:no-underline'
      onClick={router.back}
    >
      <Icon name={'chevron-left'} className='relative w-3 h-3 mr-2 top-[1px]' />
      Назад
    </a>
  );
};

export default BackLink;

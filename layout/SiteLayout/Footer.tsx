import Button from 'components/Buttons/Button';
import FakeInput from 'components/FormElements/Input/FakeInput';
import * as React from 'react';
import { useConfigContext } from 'context/configContext';
import Inner from 'components/Inner/Inner';

const Footer: React.FC = () => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configSiteName = getSiteConfigSingleValue('siteName');

  return (
    <footer className='footer relative z-[100] pt-6 pb-mobile-nav-height wp-desktop:pb-8 bg-secondary-background'>
      <Inner className='grid grid-cols-6 gap-x-6 gap-y-6'>
        <div className='col-span-2'>
          <div className='text-2xl font-medium mb-6'>
            Подписывайтесь на скидки <span className='inline-block'>и рекомендации</span>
          </div>
          <div className='flex'>
            <div className='flex-grow'>
              <FakeInput value={'Введите Ваш E-mail'} low theme={'secondary'} />
            </div>
            <div className='flex-shrink-0 w-form-input-height ml-6'>
              <Button className='w-full' icon={'arrow-right'} theme={'secondary-b'} short />
            </div>
          </div>
        </div>

        <div className='col-span-4'>lorem</div>

        <div className='col-span-2'>lorem</div>

        <div className='grid grid-cols-4 col-span-4'>
          <div />
          <div />
          <div />
          <small className='text-secondary-text text-base'>
            {configSiteName} © {new Date().getFullYear()}
          </small>
        </div>
      </Inner>
    </footer>
  );
};

export default Footer;

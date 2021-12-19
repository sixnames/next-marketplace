import { useRouter } from 'next/router';
import * as React from 'react';
import { useAppContext } from '../context/appContext';
import { useConfigContext } from '../context/configContext';
import { HeadlessMenuGroupInterface } from './HeadlessMenuButton';
import MenuButtonWithName from './MenuButtonWithName';

interface CityTriggerInterface {
  style?: React.CSSProperties;
}

const CityTrigger: React.FC<CityTriggerInterface> = ({ style }) => {
  const router = useRouter();
  const { showLoading } = useAppContext();
  const { cities, currentCity } = useConfigContext();
  const config = React.useMemo<HeadlessMenuGroupInterface[]>(() => {
    const asPathArray = router.asPath.split('/').filter((path) => path);
    const companySlug = `${asPathArray[0]}`;
    return [
      {
        children: cities.map(({ slug, name }) => {
          return {
            _id: slug,
            name: name,
            current: (menuItem) => {
              return menuItem._id === router.query.citySlug;
            },
            onSelect: () => {
              showLoading();
              window.location.href = `/${companySlug}/${slug}`;
            },
          };
        }),
      },
    ];
  }, [cities, router.asPath, router.query.citySlug, showLoading]);

  return (
    <div className='relative'>
      <MenuButtonWithName
        style={style}
        showNameAsButtonText
        initialValue={`${currentCity?.slug}`}
        config={config}
        iconPosition={'right'}
        buttonClassName='text-secondary-text'
      />
    </div>
  );
};

export default CityTrigger;

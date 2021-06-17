import * as React from 'react';
import MenuButtonWithName, { MenuButtonWithNameInterface } from 'components/MenuButtonWithName';

interface MenuButtonSorterInterface extends MenuButtonWithNameInterface {
  className?: string;
}

const MenuButtonSorter: React.FC<MenuButtonSorterInterface> = ({
  config,
  initialValue,
  className,
}) => {
  return (
    <div className={`flex items-center ${className ? className : ''}`}>
      <div className='relative top-[-1px] text-secondary-text mr-6'>Сортировать</div>
      <MenuButtonWithName config={config} initialValue={initialValue} />
    </div>
  );
};

export default MenuButtonSorter;

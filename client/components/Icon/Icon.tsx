import React from 'react';
// import { ReactComponent as Test } from './icons/catalogue/burger.svg';

import {
  Add,
  ExpandMore,
  ExpandLess,
  ChevronLeft,
  ChevronRight,
  Check,
  Edit,
  Close,
  Delete,
  FilterList,
  DateRange,
  Error,
  Search,
  Replay,
  Image,
  MoreVert,
  ShoppingCart,
  Settings,
  Person,
  ExitToApp,
  Menu,
  Instagram,
  Facebook,
  ShoppingCartOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  VisibilityOutlined,
  PersonOutlineOutlined,
  Brightness4,
  Brightness7,
  CheckBox,
  Help,
  CheckBoxOutlineBlank,
} from '@material-ui/icons';
import { ObjectType } from '../../types';

export type IconType =
  | 'Add'
  | 'ExpandMore'
  | 'ExpandLess'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'Close'
  | 'Edit'
  | 'Delete'
  | 'FilterList'
  | 'DateRange'
  | 'Error'
  | 'Search'
  | 'Replay'
  | 'Image'
  | 'MoreVert'
  | 'ShoppingCart'
  | 'Settings'
  | 'Person'
  | 'ExitToApp'
  | 'Menu'
  | 'Instagram'
  | 'Facebook'
  | 'ShoppingCartOutlined'
  | 'FavoriteBorderOutlined'
  | 'FavoriteOutlined'
  | 'VisibilityOutlined'
  | 'PersonOutlineOutlined'
  | 'Brightness4'
  | 'Brightness7'
  | 'CheckBox'
  | 'CheckBoxOutlineBlank'
  | 'Help'
  | 'Check';

interface IconPropsInterface {
  name: IconType;
  className?: string;
  style?: ObjectType;
}

const Icon: React.FC<IconPropsInterface> = ({ name, className, ...props }) => {
  switch (name) {
    case 'Help':
      return <Help className={className} {...props} />;
    case 'Add':
      return <Add className={className} {...props} />;
    case 'ExpandLess':
      return <ExpandLess className={className} {...props} />;
    case 'ChevronRight':
      return <ChevronRight className={className} {...props} />;
    case 'ExpandMore':
      return <ExpandMore className={className} {...props} />;
    case 'ChevronLeft':
      return <ChevronLeft className={className} {...props} />;
    case 'Check':
      return <Check className={className} {...props} />;
    case 'Edit':
      return <Edit className={className} {...props} />;
    case 'Delete':
      return <Delete className={className} {...props} />;
    case 'Close':
      return <Close className={className} {...props} />;
    case 'FilterList':
      return <FilterList className={className} {...props} />;
    case 'DateRange':
      return <DateRange className={className} {...props} />;
    case 'Error':
      return <Error className={className} {...props} />;
    case 'Search':
      return <Search className={className} {...props} />;
    case 'Replay':
      return <Replay className={className} {...props} />;
    case 'Image':
      return <Image className={className} {...props} />;
    case 'MoreVert':
      return <MoreVert className={className} {...props} />;
    case 'ShoppingCart':
      return <ShoppingCart className={className} {...props} />;
    case 'ShoppingCartOutlined':
      return <ShoppingCartOutlined className={className} {...props} />;
    case 'Settings':
      return <Settings className={className} {...props} />;
    case 'Person':
      return <Person className={className} {...props} />;
    case 'ExitToApp':
      return <ExitToApp className={className} {...props} />;
    case 'Menu':
      return <Menu className={className} {...props} />;
    case 'Instagram':
      return <Instagram className={className} {...props} />;
    case 'Facebook':
      return <Facebook className={className} {...props} />;
    case 'FavoriteBorderOutlined':
      return <FavoriteBorderOutlined className={className} {...props} />;
    case 'FavoriteOutlined':
      return <FavoriteOutlined className={className} {...props} />;
    case 'VisibilityOutlined':
      return <VisibilityOutlined className={className} {...props} />;
    case 'PersonOutlineOutlined':
      return <PersonOutlineOutlined className={className} {...props} />;
    case 'Brightness4':
      return <Brightness4 className={className} {...props} />;
    case 'Brightness7':
      return <Brightness7 className={className} {...props} />;
    case 'CheckBox':
      return <CheckBox className={className} {...props} />;
    case 'CheckBoxOutlineBlank':
      return <CheckBoxOutlineBlank className={className} {...props} />;
    default:
      console.log(`Icon not found - ${name}`);
      return (
        <div style={{ width: '14px', height: '14px', backgroundColor: 'gray' }} title={name} />
      );
  }
};

export default Icon;

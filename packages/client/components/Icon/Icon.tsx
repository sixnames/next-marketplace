import React from 'react';
// Catalogue
import { ReactComponent as ArrowLeft } from './icons/catalogue/arrow-left.svg';
import { ReactComponent as ArrowRight } from './icons/catalogue/arrow-right.svg';
import { ReactComponent as Burger } from './icons/catalogue/burger.svg';
import { ReactComponent as BurgerActive } from './icons/catalogue/burger-active.svg';
import { ReactComponent as Cart } from './icons/catalogue/cart.svg';
import { ReactComponent as ChevronDown } from './icons/catalogue/chevron-down.svg';
import { ReactComponent as ChevronLeft } from './icons/catalogue/chevron-left.svg';
import { ReactComponent as ChevronLeftThin } from './icons/catalogue/chevron-left-thin.svg';
import { ReactComponent as ChevronRight } from './icons/catalogue/chevron-right.svg';
import { ReactComponent as ChevronRightThin } from './icons/catalogue/chevron-right-thin.svg';
import { ReactComponent as ChevronUp } from './icons/catalogue/chevron-up.svg';
import { ReactComponent as Compare } from './icons/catalogue/compare.svg';
import { ReactComponent as Cross } from './icons/catalogue/cross.svg';
import { ReactComponent as CrossBold } from './icons/catalogue/cross-bold.svg';
import { ReactComponent as CrossThin } from './icons/catalogue/cross-thin.svg';
import { ReactComponent as Eye } from './icons/catalogue/eye.svg';
import { ReactComponent as Facebook } from './icons/catalogue/facebook.svg';
import { ReactComponent as Flash } from './icons/catalogue/flash.svg';
import { ReactComponent as Grid } from './icons/catalogue/grid.svg';
import { ReactComponent as Heart } from './icons/catalogue/heart.svg';
import { ReactComponent as HeartB } from './icons/catalogue/heart-2.svg';
import { ReactComponent as Help } from './icons/catalogue/help.svg';
import { ReactComponent as Instagram } from './icons/catalogue/instagram.svg';
import { ReactComponent as Like } from './icons/catalogue/like.svg';
import { ReactComponent as Marker } from './icons/catalogue/marker.svg';
import { ReactComponent as Message } from './icons/catalogue/message.svg';
import { ReactComponent as Moon } from './icons/catalogue/moon.svg';
import { ReactComponent as Percent } from './icons/catalogue/percent.svg';
import { ReactComponent as Picture } from './icons/catalogue/picture.svg';
import { ReactComponent as Rows } from './icons/catalogue/rows.svg';
import { ReactComponent as Scan } from './icons/catalogue/scan.svg';
import { ReactComponent as Search } from './icons/catalogue/search.svg';
import { ReactComponent as Shoot } from './icons/catalogue/shoot.svg';
import { ReactComponent as Star } from './icons/catalogue/star.svg';
import { ReactComponent as Sun } from './icons/catalogue/sun.svg';
import { ReactComponent as Upload } from './icons/catalogue/upload.svg';
import { ReactComponent as User } from './icons/catalogue/user.svg';
import { ReactComponent as Vk } from './icons/catalogue/vk.svg';
import { ReactComponent as Youtube } from './icons/catalogue/youtube.svg';
import { ReactComponent as WhiteMeat } from './icons/catalogue/white-meat.svg';
import { ReactComponent as Soup } from './icons/catalogue/soup.svg';
import { ReactComponent as Fish } from './icons/catalogue/fish.svg';
import { ReactComponent as Seafood } from './icons/catalogue/seafood.svg';

// App
import { ReactComponent as ArrowClockWise } from './icons/app/arrow-clockwise.svg';
import { ReactComponent as Check } from './icons/app/check.svg';
import { ReactComponent as Dash } from './icons/app/dash.svg';
import { ReactComponent as Exclamation } from './icons/app/exclamation.svg';
import { ReactComponent as Exit } from './icons/app/exit.svg';
import { ReactComponent as Filter } from './icons/app/filter.svg';
import { ReactComponent as Gear } from './icons/app/gear.svg';
import { ReactComponent as Image } from './icons/app/image.svg';
import { ReactComponent as Pencil } from './icons/app/pencil.svg';
import { ReactComponent as Plus } from './icons/app/plus.svg';
import { ReactComponent as Question } from './icons/app/question.svg';
import { ReactComponent as QuestionCircle } from './icons/app/question-circle.svg';
import { ReactComponent as ThreeDots } from './icons/app/three-dots.svg';
import { ReactComponent as ThreeDotsVertical } from './icons/app/three-dots-vertical.svg';
import { ReactComponent as Trash } from './icons/app/trash.svg';
import { IconType } from '@yagu/shared';

interface IconPropsInterface {
  name: IconType;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconPropsInterface> = ({ name, className, ...props }) => {
  switch (name) {
    // Catalogue
    case 'white-meat':
      return <WhiteMeat className={className} {...props} />;

    case 'soup':
      return <Soup className={className} {...props} />;

    case 'fish':
      return <Fish className={className} {...props} />;

    case 'seafood':
      return <Seafood className={className} {...props} />;

    case 'arrow-left':
      return <ArrowLeft className={className} {...props} />;

    case 'arrow-right':
      return <ArrowRight className={className} {...props} />;

    case 'burger':
      return <Burger className={className} {...props} />;

    case 'burger-active':
      return <BurgerActive className={className} {...props} />;

    case 'cart':
      return <Cart className={className} {...props} />;

    case 'chevron-down':
      return <ChevronDown className={className} {...props} />;

    case 'chevron-left':
      return <ChevronLeft className={className} {...props} />;

    case 'chevron-left-thin':
      return <ChevronLeftThin className={className} {...props} />;

    case 'chevron-right':
      return <ChevronRight className={className} {...props} />;

    case 'chevron-right-thin':
      return <ChevronRightThin className={className} {...props} />;

    case 'chevron-up':
      return <ChevronUp className={className} {...props} />;

    case 'compare':
      return <Compare className={className} {...props} />;

    case 'cross':
      return <Cross className={className} {...props} />;

    case 'cross-bold':
      return <CrossBold className={className} {...props} />;

    case 'cross-thin':
      return <CrossThin className={className} {...props} />;

    case 'eye':
      return <Eye className={className} {...props} />;

    case 'facebook':
      return <Facebook className={className} {...props} />;

    case 'flash':
      return <Flash className={className} {...props} />;

    case 'grid':
      return <Grid className={className} {...props} />;

    case 'heart':
      return <Heart className={className} {...props} />;

    case 'heart-2':
      return <HeartB className={className} {...props} />;

    case 'help':
      return <Help className={className} {...props} />;

    case 'instagram':
      return <Instagram className={className} {...props} />;

    case 'like':
      return <Like className={className} {...props} />;

    case 'marker':
      return <Marker className={className} {...props} />;

    case 'message':
      return <Message className={className} {...props} />;

    case 'moon':
      return <Moon className={className} {...props} />;

    case 'percent':
      return <Percent className={className} {...props} />;

    case 'picture':
      return <Picture className={className} {...props} />;

    case 'rows':
      return <Rows className={className} {...props} />;

    case 'scan':
      return <Scan className={className} {...props} />;

    case 'search':
      return <Search className={className} {...props} />;

    case 'shoot':
      return <Shoot className={className} {...props} />;

    case 'star':
      return <Star className={className} {...props} />;

    case 'sun':
      return <Sun className={className} {...props} />;

    case 'upload':
      return <Upload className={className} {...props} />;

    case 'user':
      return <User className={className} {...props} />;

    case 'vk':
      return <Vk className={className} {...props} />;

    case 'youtube':
      return <Youtube className={className} {...props} />;

    // App
    case 'arrow-clockwise':
      return <ArrowClockWise className={className} {...props} />;

    case 'check':
      return <Check className={className} {...props} />;

    case 'dash':
      return <Dash className={className} {...props} />;

    case 'exclamation':
      return <Exclamation className={className} {...props} />;

    case 'exit':
      return <Exit className={className} {...props} />;

    case 'filter':
      return <Filter className={className} {...props} />;

    case 'gear':
      return <Gear className={className} {...props} />;

    case 'image':
      return <Image className={className} {...props} />;

    case 'pencil':
      return <Pencil className={className} {...props} />;

    case 'plus':
      return <Plus className={className} {...props} />;

    case 'question':
      return <Question className={className} {...props} />;

    case 'question-circle':
      return <QuestionCircle className={className} {...props} />;

    case 'three-dots':
      return <ThreeDots className={className} {...props} />;

    case 'three-dots-vertical':
      return <ThreeDotsVertical className={className} {...props} />;

    case 'trash':
      return <Trash className={className} {...props} />;

    default:
      console.log(`Icon not found - ${name}`);
      return (
        <div style={{ width: '14px', height: '14px', backgroundColor: 'gray' }} title={name} />
      );
  }
};

export default Icon;

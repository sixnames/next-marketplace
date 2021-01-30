import * as React from 'react';
import { IconType } from 'types/iconTypes';
import dynamic from 'next/dynamic';

const IconArrowClockwise = dynamic(() => import('./IconArrowClockwise'));
const IconArrowLeft = dynamic(() => import('./IconArrowLeft'));
const IconArrowRight = dynamic(() => import('./IconArrowRight'));
const IconBurger = dynamic(() => import('./IconBurger'));
const IconBurgerActive = dynamic(() => import('./IconBurgerActive'));
const IconCart = dynamic(() => import('./IconCart'));
const IconCheck = dynamic(() => import('./IconCheck'));
const IconChevronDown = dynamic(() => import('./IconChevronDown'));
const IconChevronLeft = dynamic(() => import('./IconChevronLeft'));
const IconChevronLeftThin = dynamic(() => import('./IconChevronLeftThin'));
const IconChevronRight = dynamic(() => import('./IconChevronRight'));
const IconChevronRightThin = dynamic(() => import('./IconChevronRightThin'));
const IconChevronUp = dynamic(() => import('./IconChevronUp'));
const IconCompare = dynamic(() => import('./IconCompare'));
const IconCross = dynamic(() => import('./IconCross'));
const IconCrossBold = dynamic(() => import('./IconCrossBold'));
const IconCrossThin = dynamic(() => import('./IconCrossThin'));
const IconDash = dynamic(() => import('./IconDash'));
const IconExclamation = dynamic(() => import('./IconExclamation'));
const IconExit = dynamic(() => import('./IconExit'));
const IconEye = dynamic(() => import('./IconEye'));
const IconFacebook = dynamic(() => import('./IconFacebook'));
const IconFilter = dynamic(() => import('./IconFilter'));
const IconFish = dynamic(() => import('./IconFish'));
const IconFlash = dynamic(() => import('./IconFlash'));
const IconGear = dynamic(() => import('./IconGear'));
const IconGrid = dynamic(() => import('./IconGrid'));
const IconHeart = dynamic(() => import('./IconHeart'));
const IconHeartTwo = dynamic(() => import('./IconHeartTwo'));
const IconHelp = dynamic(() => import('./IconHelp'));
const IconImage = dynamic(() => import('./IconImage'));
const IconInstagram = dynamic(() => import('./IconInstagram'));
const IconLike = dynamic(() => import('./IconLike'));
const IconMarker = dynamic(() => import('./IconMarker'));
const IconMessage = dynamic(() => import('./IconMessage'));
const IconMoon = dynamic(() => import('./IconMoon'));
const IconPencil = dynamic(() => import('./IconPencil'));
const IconPercent = dynamic(() => import('./IconPercent'));
const IconPicture = dynamic(() => import('./IconPicture'));
const IconPlus = dynamic(() => import('./IconPlus'));
const IconQuestion = dynamic(() => import('./IconQuestion'));
const IconQuestionCircle = dynamic(() => import('./IconQuestionCircle'));
const IconRows = dynamic(() => import('./IconRows'));
const IconScan = dynamic(() => import('./IconScan'));
const IconSeafood = dynamic(() => import('./IconSeafood'));
const IconSearch = dynamic(() => import('./IconSearch'));
const IconShot = dynamic(() => import('./IconShot'));
const IconSoup = dynamic(() => import('./IconSoup'));
const IconStar = dynamic(() => import('./IconStar'));
const IconSun = dynamic(() => import('./IconSun'));
const IconThreeDots = dynamic(() => import('./IconThreeDots'));
const IconThreeDotsVertical = dynamic(() => import('./IconThreeDotsVertical'));
const IconTrash = dynamic(() => import('./IconTrash'));
const IconUpload = dynamic(() => import('./IconUpload'));
const IconUser = dynamic(() => import('./IconUser'));
const IconVk = dynamic(() => import('./IconVk'));
const IconWhiteMeat = dynamic(() => import('./IconWhiteMeat'));
const IconYoutube = dynamic(() => import('./IconYoutube'));

interface IconPropsInterface {
  name: IconType;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconPropsInterface> = ({ name, className, style }) => {
  const iconProps: any = React.useMemo(() => {
    return { className, style };
  }, [className, style]);

  if (name === 'arrow-left') {
    return <IconArrowLeft {...iconProps} />;
  }

  if (name === 'arrow-right') {
    return <IconArrowRight {...iconProps} />;
  }

  if (name === 'arrow-right') {
    return <IconArrowRight {...iconProps} />;
  }

  if (name === 'burger') {
    return <IconBurger {...iconProps} />;
  }

  if (name === 'burger-active') {
    return <IconBurgerActive {...iconProps} />;
  }

  if (name === 'cart') {
    return <IconCart {...iconProps} />;
  }

  if (name === 'chevron-down') {
    return <IconChevronDown {...iconProps} />;
  }

  if (name === 'chevron-left') {
    return <IconChevronLeft {...iconProps} />;
  }

  if (name === 'chevron-left-thin') {
    return <IconChevronLeftThin {...iconProps} />;
  }

  if (name === 'chevron-right') {
    return <IconChevronRight {...iconProps} />;
  }

  if (name === 'chevron-right-thin') {
    return <IconChevronRightThin {...iconProps} />;
  }

  if (name === 'chevron-up') {
    return <IconChevronUp {...iconProps} />;
  }

  if (name === 'compare') {
    return <IconCompare {...iconProps} />;
  }

  if (name === 'cross') {
    return <IconCross {...iconProps} />;
  }

  if (name === 'cross-bold') {
    return <IconCrossBold {...iconProps} />;
  }

  if (name === 'cross-thin') {
    return <IconCrossThin {...iconProps} />;
  }

  if (name === 'eye') {
    return <IconEye {...iconProps} />;
  }

  if (name === 'facebook') {
    return <IconFacebook {...iconProps} />;
  }

  if (name === 'flash') {
    return <IconFlash {...iconProps} />;
  }

  if (name === 'grid') {
    return <IconGrid {...iconProps} />;
  }

  if (name === 'heart') {
    return <IconHeart {...iconProps} />;
  }

  if (name === 'heart-2') {
    return <IconHeartTwo {...iconProps} />;
  }

  if (name === 'help') {
    return <IconHelp {...iconProps} />;
  }

  if (name === 'instagram') {
    return <IconInstagram {...iconProps} />;
  }

  if (name === 'like') {
    return <IconLike {...iconProps} />;
  }

  if (name === 'marker') {
    return <IconMarker {...iconProps} />;
  }

  if (name === 'message') {
    return <IconMessage {...iconProps} />;
  }

  if (name === 'moon') {
    return <IconMoon {...iconProps} />;
  }

  if (name === 'percent') {
    return <IconPercent {...iconProps} />;
  }

  if (name === 'picture') {
    return <IconPicture {...iconProps} />;
  }

  if (name === 'rows') {
    return <IconRows {...iconProps} />;
  }

  if (name === 'scan') {
    return <IconScan {...iconProps} />;
  }

  if (name === 'search') {
    return <IconSearch {...iconProps} />;
  }

  if (name === 'shoot') {
    return <IconShot {...iconProps} />;
  }

  if (name === 'star') {
    return <IconStar {...iconProps} />;
  }

  if (name === 'sun') {
    return <IconSun {...iconProps} />;
  }

  if (name === 'upload') {
    return <IconUpload {...iconProps} />;
  }

  if (name === 'user') {
    return <IconUser {...iconProps} />;
  }

  if (name === 'vk') {
    return <IconVk {...iconProps} />;
  }

  if (name === 'youtube') {
    return <IconYoutube {...iconProps} />;
  }

  if (name === 'white-meat') {
    return <IconWhiteMeat {...iconProps} />;
  }

  if (name === 'soup') {
    return <IconSoup {...iconProps} />;
  }

  if (name === 'fish') {
    return <IconFish {...iconProps} />;
  }

  if (name === 'seafood') {
    return <IconSeafood {...iconProps} />;
  }

  if (name === 'arrow-clockwise') {
    return <IconArrowClockwise {...iconProps} />;
  }

  if (name === 'check') {
    return <IconCheck {...iconProps} />;
  }

  if (name === 'dash') {
    return <IconDash {...iconProps} />;
  }

  if (name === 'exclamation') {
    return <IconExclamation {...iconProps} />;
  }

  if (name === 'exit') {
    return <IconExit {...iconProps} />;
  }

  if (name === 'filter') {
    return <IconFilter {...iconProps} />;
  }

  if (name === 'gear') {
    return <IconGear {...iconProps} />;
  }

  if (name === 'image') {
    return <IconImage {...iconProps} />;
  }

  if (name === 'pencil') {
    return <IconPencil {...iconProps} />;
  }

  if (name === 'plus') {
    return <IconPlus {...iconProps} />;
  }

  if (name === 'question') {
    return <IconQuestion {...iconProps} />;
  }

  if (name === 'question-circle') {
    return <IconQuestionCircle {...iconProps} />;
  }

  if (name === 'three-dots') {
    return <IconThreeDots {...iconProps} />;
  }

  if (name === 'three-dots-vertical') {
    return <IconThreeDotsVertical {...iconProps} />;
  }

  if (name === 'trash') {
    return <IconTrash {...iconProps} />;
  }

  // Icon not found
  console.log(`Icon not found - ${name}`);
  return <div style={{ width: '14px', height: '14px', backgroundColor: 'gray' }} title={name} />;
};

export default Icon;

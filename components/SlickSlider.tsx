import * as React from 'react';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type SlickSliderInterface = Settings;

const SlickSlider: React.FC<SlickSliderInterface> = ({ children, ...props }) => {
  const sliderConfig = React.useMemo<Settings>(() => {
    return {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      ...props,
    };
  }, [props]);

  return (
    <div className='wp-slider'>
      <Slider {...sliderConfig}>{children}</Slider>
    </div>
  );
};

export default SlickSlider;

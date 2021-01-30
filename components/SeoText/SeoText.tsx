import StringButton from 'components/Buttons/StringButton';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import * as React from 'react';
import classes from './SeoText.module.css';

interface SeoTextInterface {
  text: any;
  title: string;
}

const SeoText: React.FC<SeoTextInterface> = ({ text, title }) => {
  const [isSeoTextOpen, setIsSeoTextOpen] = React.useState<boolean>(false);
  const seoTextButtonLabel = isSeoTextOpen ? 'Скрыть' : 'Читать далее';

  return (
    <Inner>
      <div className={`${classes.seoTextHolder}`}>
        <Title size={'small'} tag={'h3'}>
          {title}
        </Title>
        <div
          className={`${classes.seoText} ${isSeoTextOpen ? classes.seoTextActive : ''}`}
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <StringButton onClick={() => setIsSeoTextOpen((prevState) => !prevState)}>
          {seoTextButtonLabel}
        </StringButton>
      </div>
    </Inner>
  );
};

export default SeoText;

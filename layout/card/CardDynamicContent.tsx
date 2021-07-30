import PageEditor from 'components/PageEditor';
import { PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'config/common';
import { ProductCardContentInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface CardDynamicContentInterface {
  cardContent?: ProductCardContentInterface | null | undefined;
  className?: string;
}

const CardDynamicContent: React.FC<CardDynamicContentInterface> = ({ cardContent, className }) => {
  if (
    !cardContent ||
    !cardContent.value ||
    cardContent.value === PAGE_EDITOR_DEFAULT_VALUE_STRING
  ) {
    return null;
  }

  return (
    <div className={`mb-28 ${className ? className : ''}`}>
      <PageEditor value={JSON.parse(cardContent.value)} readOnly />
    </div>
  );
};

export default CardDynamicContent;

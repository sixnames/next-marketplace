import PageEditor from 'components/PageEditor';
import { PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'config/common';
import { SeoContentModel } from 'db/dbModels';
import * as React from 'react';

interface CardDynamicContentInterface {
  cardContent?: SeoContentModel | null | undefined;
  className?: string;
}

const CardDynamicContent: React.FC<CardDynamicContentInterface> = ({ cardContent, className }) => {
  if (
    !cardContent ||
    !cardContent.content ||
    cardContent.content === PAGE_EDITOR_DEFAULT_VALUE_STRING
  ) {
    return null;
  }

  return (
    <div className={`mb-28 ${className ? className : ''}`}>
      <PageEditor value={JSON.parse(cardContent.content)} readOnly />
    </div>
  );
};

export default CardDynamicContent;

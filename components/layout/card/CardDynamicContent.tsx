import WpButton from 'components/button/WpButton';
import { useSiteUserContext } from 'components/context/siteUserContext';
import PageEditor from 'components/PageEditor';
import SeoTextLocalesInfoList from 'components/SeoTextLocalesInfoList';
import { SeoContentModel } from 'db/dbModels';
import { ProductFacetInterface } from 'db/uiInterfaces';
import { PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'lib/config/common';
import * as React from 'react';

interface CardDynamicContentInterface {
  cardContent?: SeoContentModel | null | undefined;
  className?: string;
  product: ProductFacetInterface;
}

const CardDynamicContent: React.FC<CardDynamicContentInterface> = ({
  cardContent,
  product,
  className,
}) => {
  const sessionUser = useSiteUserContext();

  if (
    !cardContent ||
    !cardContent.content ||
    cardContent.content === PAGE_EDITOR_DEFAULT_VALUE_STRING
  ) {
    return sessionUser?.showAdminUiInCatalogue ? (
      <div className='mt-6 mb-8'>
        <WpButton
          size={'small'}
          onClick={() => {
            window.open(
              `${sessionUser.editLinkBasePath}/rubrics/${product.rubricId}/products/product/${product._id}/editor`,
              '_blank',
            );
          }}
        >
          Редактировать SEO блок
        </WpButton>
      </div>
    ) : null;
  }

  return (
    <div className={`mb-28 ${className ? className : ''}`}>
      <PageEditor value={JSON.parse(cardContent.content)} readOnly />

      {sessionUser?.showAdminUiInCatalogue ? (
        <div className='mt-6 mb-8'>
          <div className='mb-8'>
            <SeoTextLocalesInfoList
              seoLocales={cardContent.seoLocales}
              listClassName='flex gap-4 flex-wrap'
            />
          </div>

          <WpButton
            size={'small'}
            onClick={() => {
              window.open(
                `${sessionUser.editLinkBasePath}/rubrics/${product.rubricId}/products/product/${product._id}/editor`,
                '_blank',
              );
            }}
          >
            Редактировать SEO блок
          </WpButton>
        </div>
      ) : null}
    </div>
  );
};

export default CardDynamicContent;

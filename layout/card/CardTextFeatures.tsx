import TextSeoInfo from 'components/TextSeoInfo';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { TextUniquenessApiParsedResponseModel } from 'db/dbModels';
import { ProductAttributeInterface, ProductCardDescriptionInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface CardTextFeaturesInterface {
  textFeatures: ProductAttributeInterface[];
  className?: string;
  cardDescription?: ProductCardDescriptionInterface | null;
}

const CardTextFeatures: React.FC<CardTextFeaturesInterface> = ({
  textFeatures,
  children,
  cardDescription,
  className,
}) => {
  const sessionUser = useSiteUserContext();
  if (textFeatures.length < 1 && !cardDescription) {
    return null;
  }

  return (
    <div className={className}>
      {cardDescription && cardDescription.text ? (
        <section className='mb-8'>
          <h2 className='text-2xl mb-4 font-medium'>Описание</h2>
          <div className='prose max-w-full'>
            <p>{cardDescription.text}</p>
          </div>

          {sessionUser?.showAdminUiInCatalogue ? (
            <div className='space-y-3 mt-6'>
              {(cardDescription.seo?.locales || []).map(
                (seoLocale: TextUniquenessApiParsedResponseModel) => {
                  return (
                    <TextSeoInfo
                      showLocaleName
                      listClassName='flex gap-3 flex-wrap'
                      key={seoLocale.locale}
                      seoLocale={seoLocale}
                    />
                  );
                },
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {textFeatures.map(({ _id, attribute, readableValue }) => {
        if (!readableValue || !attribute) {
          return null;
        }
        return (
          <section className='mb-8' key={`${_id}`}>
            <h2 className='text-2xl mb-4 font-medium'>{attribute.name}</h2>
            <div className='prose max-w-full'>
              <p>{readableValue}</p>
            </div>
          </section>
        );
      })}
      {children}
    </div>
  );
};

export default CardTextFeatures;

import TextSeoInfo from 'components/TextSeoInfo';
import { useConfigContext } from 'context/configContext';
import { ProductSeoModel, TextUniquenessApiParsedResponseModel } from 'db/dbModels';
import { ProductAttributeInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface CardTextFeaturesInterface {
  textFeatures: ProductAttributeInterface[];
  className?: string;
  cardDescription?: string | null;
  productSeo?: ProductSeoModel | null;
}

const CardTextFeatures: React.FC<CardTextFeaturesInterface> = ({
  textFeatures,
  children,
  cardDescription,
  className,
  productSeo,
}) => {
  const { configs } = useConfigContext();
  if (textFeatures.length < 1 && !cardDescription) {
    return null;
  }

  return (
    <div className={className}>
      {cardDescription ? (
        <section className='mb-8'>
          <h2 className='text-2xl mb-4 font-medium'>Описание</h2>
          <div className='prose max-w-full'>
            <p>{cardDescription}</p>
          </div>

          {configs.showAdminUiInCatalogue ? (
            <div className='space-y-3 mt-6'>
              {(productSeo?.locales || []).map(
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

      {textFeatures.map(({ _id, name, readableValue }) => {
        if (!readableValue) {
          return null;
        }
        return (
          <section className='mb-8' key={`${_id}`}>
            <h2 className='text-2xl mb-4 font-medium'>{name}</h2>
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

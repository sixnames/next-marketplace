import Accordion from 'components/Accordion';
import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import InputLine from 'components/FormElements/Input/InputLine';
import PageEditor from 'components/PageEditor';
import SeoTextLocalesInfoList from 'components/SeoTextLocalesInfoList';
import {
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  REQUEST_METHOD_POST,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import { SeoContentInterface } from 'db/uiInterfaces';
import { useFormikContext } from 'formik';
import { useUpdateSeoContent } from 'hooks/mutations/useSeoContentMutations';
import * as React from 'react';
import { get } from 'lodash';

interface SingleSeoContentEditorInterface {
  filedName: string;
  seoContentId: string;
  label?: string;
}

export const SingleSeoContentEditor: React.FC<SingleSeoContentEditorInterface> = ({
  filedName,
  seoContentId,
  label,
}) => {
  const { setFieldValue, values } = useFormikContext();
  const contentFieldName = filedName ? `${filedName}.content` : 'content';
  const seoLocalesFieldName = filedName ? `${filedName}.seoLocales` : 'seoLocales';
  const value = get(values, contentFieldName) || PAGE_EDITOR_DEFAULT_VALUE_STRING;
  const seoLocales = get(values, seoLocalesFieldName) || [];

  return (
    <InputLine labelTag={'div'} label={label}>
      {seoLocales.length > 0 ? (
        <div className='mb-8'>
          <SeoTextLocalesInfoList seoLocales={seoLocales} listClassName='flex gap-4 flex-wrap' />
        </div>
      ) : null}

      <PageEditor
        value={JSON.parse(value)}
        setValue={(value) => {
          setFieldValue(contentFieldName, JSON.stringify(value));
        }}
        imageUpload={async (file) => {
          try {
            const formData = new FormData();
            formData.append('seoContentId', seoContentId);
            formData.append('assets', file);

            const responseFetch = await fetch('/api/seo-content/add-asset', {
              method: REQUEST_METHOD_POST,
              body: formData,
            });
            const responseJson = await responseFetch.json();

            if (!responseJson.url) {
              return {
                url: '',
              };
            }

            return {
              url: responseJson.url,
            };
          } catch (e) {
            console.log(e);
            return {
              url: '',
            };
          }
        }}
      />
    </InputLine>
  );
};

interface SeoContentEditorInterface {
  filedName: string;
  label?: string | null;
  hideIndexCheckbox?: boolean;
}

const SeoContentEditor: React.FC<SeoContentEditorInterface> = ({
  filedName,
  label,
  hideIndexCheckbox,
}) => {
  const { cities } = useConfigContext();
  const { values } = useFormikContext();
  const [updateSeoContentMutation] = useUpdateSeoContent();

  return (
    <InputLine labelTag={'div'} label={label}>
      {cities.map((city) => {
        const cityFieldName = `${filedName}.${city.slug}`;
        const seoContent = get(values, `${filedName}.${city.slug}`) as SeoContentInterface;
        const showSeoFields = seoContent.slug.indexOf(CATALOGUE_SEO_TEXT_POSITION_TOP) > -1;

        return (
          <div key={city.slug}>
            <Accordion title={`${city.name}`} isOpen={city.slug === DEFAULT_CITY}>
              <div className='ml-8 pt-[var(--lineGap-200)]'>
                {!hideIndexCheckbox && showSeoFields ? (
                  <label className='flex gap-2 items-center cursor-pointer mb-6'>
                    <Checkbox
                      checked={Boolean(seoContent.showForIndex)}
                      name={'showForIndex'}
                      onChange={() => {
                        updateSeoContentMutation({
                          companySlug: seoContent.companySlug,
                          seoContentId: `${seoContent._id}`,
                          content: seoContent.content,
                          showForIndex: !seoContent.showForIndex,
                          metaTitleI18n: seoContent.metaTitleI18n,
                          metaDescriptionI18n: seoContent.metaDescriptionI18n,
                          titleI18n: seoContent.titleI18n,
                        }).catch(console.log);
                      }}
                    />
                    <span>Открыть для индексации</span>
                  </label>
                ) : null}

                <SingleSeoContentEditor
                  filedName={cityFieldName}
                  seoContentId={`${seoContent._id}`}
                />
              </div>
            </Accordion>
          </div>
        );
      })}
    </InputLine>
  );
};

export default SeoContentEditor;

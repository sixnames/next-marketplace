import { useConfigContext } from 'components/context/configContext';
import { SeoContentInterface } from 'db/uiInterfaces';
import { useFormikContext } from 'formik';
import {
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { get } from 'lodash';
import * as React from 'react';
import InputLine from './FormElements/Input/InputLine';
import PageEditor from './PageEditor';
import SeoContentNoIndexTrigger from './SeoContentNoIndexTrigger';
import SeoTextLocalesInfoList from './SeoTextLocalesInfoList';
import WpAccordion from './WpAccordion';

interface SingleSeoContentEditorInterface {
  fieldName: string;
  seoContentId: string;
  label?: string;
}

export const SingleSeoContentEditor: React.FC<SingleSeoContentEditorInterface> = ({
  fieldName,
  seoContentId,
  label,
}) => {
  const { setFieldValue, values } = useFormikContext();
  const contentFieldName = fieldName ? `${fieldName}.content` : 'content';
  const seoLocalesFieldName = fieldName ? `${fieldName}.seoLocales` : 'seoLocales';
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

  return (
    <InputLine labelTag={'div'} label={label}>
      {cities.map((city) => {
        const cityFieldName = `${filedName}.${city.slug}`;
        const seoContent = get(values, `${filedName}.${city.slug}`) as SeoContentInterface;
        const showSeoFields = seoContent.slug.indexOf(CATALOGUE_SEO_TEXT_POSITION_TOP) > -1;

        return (
          <div key={city.slug}>
            <WpAccordion title={`${city.name}`} isOpen={city.slug === DEFAULT_CITY}>
              <div className='ml-8 pt-[var(--lineGap-200)]'>
                {!hideIndexCheckbox && showSeoFields ? (
                  <SeoContentNoIndexTrigger seoContent={seoContent} />
                ) : null}

                <SingleSeoContentEditor
                  fieldName={cityFieldName}
                  seoContentId={`${seoContent._id}`}
                />
              </div>
            </WpAccordion>
          </div>
        );
      })}
    </InputLine>
  );
};

export default SeoContentEditor;

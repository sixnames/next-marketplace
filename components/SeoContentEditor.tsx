import Accordion from 'components/Accordion';
import InputLine from 'components/FormElements/Input/InputLine';
import PageEditor from 'components/PageEditor';
import SeoTextLocalesInfoList from 'components/SeoTextLocalesInfoList';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING, REQUEST_METHOD_POST } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useFormikContext } from 'formik';
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
}

const SeoContentEditor: React.FC<SeoContentEditorInterface> = ({ filedName, label }) => {
  const { cities } = useConfigContext();
  const { values } = useFormikContext();

  return (
    <InputLine labelTag={'div'} label={label}>
      {cities.map((city) => {
        const cityFieldName = `${filedName}.${city.slug}`;
        const _id = get(values, `${filedName}.${city.slug}._id`);

        return (
          <div key={city.slug}>
            <Accordion title={`${city.name}`} isOpen={city.slug === DEFAULT_CITY}>
              <div className='ml-8 pt-[var(--lineGap-200)]'>
                <SingleSeoContentEditor filedName={cityFieldName} seoContentId={_id} />
              </div>
            </Accordion>
          </div>
        );
      })}
    </InputLine>
  );
};

export default SeoContentEditor;

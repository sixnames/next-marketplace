import Accordion from 'components/Accordion';
import InputLine from 'components/FormElements/Input/InputLine';
import PageEditor from 'components/PageEditor';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING, REQUEST_METHOD_POST } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { get } from 'lodash';

interface SeoTextEditorInterface {
  filedName: string;
  label: string;
}

const SeoTextEditor: React.FC<SeoTextEditorInterface> = ({ filedName, label }) => {
  const { cities } = useConfigContext();
  const { values, setFieldValue } = useFormikContext();

  return (
    <InputLine labelTag={'div'} label={label}>
      {cities.map((city) => {
        const cityFieldName = `${filedName}.${city.slug}.content`;
        const value = get(values, cityFieldName) || PAGE_EDITOR_DEFAULT_VALUE_STRING;
        const _id = get(values, `${filedName}.${city.slug}._id`);

        return (
          <div key={city.slug}>
            <Accordion title={`${city.name}`} isOpen={city.slug === DEFAULT_CITY}>
              <div className='ml-8 pt-[var(--lineGap-200)]'>
                <PageEditor
                  value={JSON.parse(value)}
                  setValue={(value) => {
                    setFieldValue(cityFieldName, JSON.stringify(value));
                  }}
                  imageUpload={async (file) => {
                    try {
                      const formData = new FormData();
                      formData.append('seoTextId', _id);
                      formData.append('assets', file);

                      const responseFetch = await fetch('/api/seo-text/add-asset', {
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
              </div>
            </Accordion>
          </div>
        );
      })}
    </InputLine>
  );
};

export default SeoTextEditor;

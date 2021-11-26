import Accordion from 'components/Accordion';
import PageEditor from 'components/PageEditor';
import { REQUEST_METHOD_POST } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { get } from 'lodash';

interface SeoTextEditorInterface {
  filedName: string;
}

const SeoTextEditor: React.FC<SeoTextEditorInterface> = ({ filedName }) => {
  const { cities } = useConfigContext();
  const { values, setFieldValue } = useFormikContext();

  return (
    <React.Fragment>
      {cities.map((city) => {
        const cityFieldName = `${filedName}.${city.slug}.content`;
        const value = get(values, cityFieldName);
        const _id = get(values, `${filedName}.${city.slug}._id`);

        return (
          <div key={city.slug}>
            <Accordion title={`${city.name}`}>
              <PageEditor
                value={value}
                setValue={(value) => {
                  setFieldValue(cityFieldName, value);
                }}
                imageUpload={async (file) => {
                  try {
                    const formData = new FormData();
                    formData.append('seoTextId', _id);
                    formData.append('assets', file);

                    const responseFetch = await fetch('/api/seo-texts/add-asset', {
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
            </Accordion>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default SeoTextEditor;

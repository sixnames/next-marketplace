import { CellPlugin } from '@react-page/editor/lib/core/types/plugins';
import * as React from 'react';
import '@react-page/editor/lib/index.css';
import '@react-page/plugins-image/lib/index.css';
import '@react-page/plugins-slate/lib/index.css';
import type { Value } from '@react-page/editor';
import spacer from '@react-page/plugins-spacer';
import divider from '@react-page/plugins-divider';
import Editor from '@react-page/editor';
import slate from '@react-page/plugins-slate';
import { imagePlugin } from '@react-page/plugins-image';
// import type { ImageUploadType } from '@react-page/plugins-image';

const cellPlugins = (page: string): CellPlugin[] => [
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  slate(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  spacer,
  divider,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  imagePlugin({
    imageUpload: async (file) => {
      try {
        const formData = new FormData();
        formData.append('page', page);
        formData.append('assets', file);

        const responseFetch = await fetch('/api/add-page-asset', {
          method: 'POST',
          body: formData,
        });
        const responseJson = await responseFetch.json();

        return {
          url: responseJson.url,
        };
      } catch (e) {
        console.log(e);
        return {
          url: '',
        };
      }
    },
  }),
];

const defaultValue: Value = {
  id: '1',
  version: 1,
  rows: [],
};

interface PageEditorInterface {
  readOnly?: boolean;
  initialValue?: Value;
  page: string;
  onSubmit?: (value: Value) => void;
}

const PageEditor: React.FC<PageEditorInterface> = ({ initialValue, page, readOnly }) => {
  const [value, setValue] = React.useState<Value>(() => {
    return initialValue || defaultValue;
  });

  return (
    <Editor readOnly={readOnly} cellPlugins={cellPlugins(page)} value={value} onChange={setValue} />
  );
};

export default PageEditor;

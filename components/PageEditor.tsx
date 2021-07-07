import { Languages } from '@react-page/editor/lib/core/EditorStore';
import { CellPlugin } from '@react-page/editor/lib/core/types/plugins';
import { PAGE_EDITOR_DEFAULT_VALUE } from 'config/common';
import { useLocaleContext } from 'context/localeContext';
import * as React from 'react';
import '@react-page/editor/lib/index.css';
import '@react-page/plugins-image/lib/index.css';
import '@react-page/plugins-slate/lib/index.css';
import type { ImageUploadType, Value } from '@react-page/editor';
import spacer from '@react-page/plugins-spacer';
import divider from '@react-page/plugins-divider';
import Editor from '@react-page/editor';
import slate from '@react-page/plugins-slate';
import { imagePlugin } from '@react-page/plugins-image';

const cellPlugins = (imageUpload?: ImageUploadType): CellPlugin[] => [
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
    imageUpload,
  }),
];

interface PageEditorInterface {
  readOnly?: boolean;
  value?: Value;
  setValue?: (value: Value) => void;
  imageUpload?: ImageUploadType;
}

const PageEditor: React.FC<PageEditorInterface> = ({ value, readOnly, imageUpload, setValue }) => {
  const { languagesList, locale } = useLocaleContext();
  const languages: Languages = React.useMemo(() => {
    return languagesList.map((locale) => {
      return {
        label: locale.name,
        lang: locale.slug,
      };
    });
  }, [languagesList]);

  return (
    <Editor
      cellSpacing={30}
      allowMoveInEditMode
      allowResizeInEditMode
      readOnly={readOnly}
      cellPlugins={cellPlugins(imageUpload)}
      value={value || PAGE_EDITOR_DEFAULT_VALUE}
      onChange={setValue}
      languages={languages}
      lang={locale}
    />
  );
};

export default PageEditor;

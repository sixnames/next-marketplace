import { PAGE_EDITOR_DEFAULT_VALUE } from 'config/common';
import { useLocaleContext } from 'context/localeContext';
import * as React from 'react';

// editor
import Editor, { ColorPickerField } from '@react-page/editor';
import type { ImageUploadType, Value } from '@react-page/editor';
import '@react-page/editor/lib/index.css';

// plugins
import spacer from '@react-page/plugins-spacer';
import divider from '@react-page/plugins-divider';
import slate, { pluginFactories } from '@react-page/plugins-slate';
import '@react-page/plugins-slate/lib/index.css';

import { imagePlugin } from '@react-page/plugins-image';
import '@react-page/plugins-image/lib/index.css';

import { Languages } from '@react-page/editor/lib/core/EditorStore';
import { CellPlugin } from '@react-page/editor/lib/core/types/plugins';

// video
// import html5video from '@react-page/plugins-html5-video';
import video from '@react-page/plugins-video';

// text color
const customSlatePlugin = pluginFactories.createComponentPlugin<{
  color: string;
}>({
  addHoverButton: true,
  addToolbarButton: true,
  type: 'SetColor',
  object: 'mark',
  icon: <span>Цвет</span>,
  label: 'Назначить цвет',
  Component: 'span',
  getStyle: ({ color }) => ({ color }),
  controls: {
    type: 'autoform',
    schema: {
      type: 'object',
      required: ['color'],
      properties: {
        color: {
          uniforms: {
            component: ColorPickerField,
          },
          default: 'rgba(0,0,255,1)',
          type: 'string',
        },
      },
    },
  },
});

// text formatting
export const defaultSlate = slate((def) => ({
  ...def,
  plugins: {
    // this will pull in all predefined plugins
    ...def.plugins,
    // you can also add custom plugins. The namespace `custom` is just for organizing plugins
    custom: {
      custom1: customSlatePlugin,
      // katex: katexSlatePlugin,
    },
  },
}));

export const reactPageCellPlugins = (imageUpload?: ImageUploadType): CellPlugin[] => [
  divider,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  defaultSlate,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  video,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // html5video,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  spacer,
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

  if (readOnly && value && JSON.stringify(value) === JSON.stringify(PAGE_EDITOR_DEFAULT_VALUE)) {
    return null;
  }

  return (
    <Editor
      cellSpacing={30}
      allowMoveInEditMode
      allowResizeInEditMode
      readOnly={readOnly}
      cellPlugins={reactPageCellPlugins(imageUpload)}
      value={value || PAGE_EDITOR_DEFAULT_VALUE}
      onChange={setValue}
      languages={languages}
      lang={locale}
    />
  );
};

export default PageEditor;

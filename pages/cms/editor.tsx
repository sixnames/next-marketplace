import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import '@react-page/editor/lib/index.css';
import '@react-page/plugins-slate/lib/index.css';
import '@react-page/plugins-image/lib/index.css';
import type { Value } from '@react-page/editor';
import Editor from '@react-page/editor';
import slate from '@react-page/plugins-slate';
import { imagePlugin } from '@react-page/plugins-image';
import type { ImageUploadType } from '@react-page/plugins-image';

const imageUpload: ImageUploadType = async (file) => {
  try {
    const formData = new FormData();
    formData.append('page', 'page');
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
};

const cellPlugins = [
  slate(),
  imagePlugin({
    imageUpload,
  }),
];

const EditorPage: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  /*const [value, setValue] = React.useState<Value>({
    id: '1',
    rows: [],
    version: 1,
  });*/
  const [value, setValue] = React.useState<Value>({
    id: '1',
    version: 1,
    rows: [
      {
        id: 'el2yzj',
        cells: [
          {
            id: 'ppcfbj',
            size: 6,
            plugin: {
              id: 'ory/editor/core/content/image',
              version: 1,
            },
            dataI18n: {
              default: {
                src: 'https://wp-test.storage.yandexcloud.net/pages/page/1623685487435-2.jpg',
              },
            },
            rows: [],
            inline: null,
          },
          {
            id: 'hzq58d',
            size: 6,
            plugin: {
              id: 'ory/editor/core/content/slate',
              version: 1,
            },
            dataI18n: {
              default: {
                slate: [
                  {
                    children: [
                      {
                        text: 'Header',
                      },
                    ],
                    type: 'HEADINGS/HEADING-ONE',
                  },
                  {
                    children: [
                      {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?',
                      },
                    ],
                  },
                  {
                    children: [
                      {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?',
                      },
                    ],
                  },
                  {
                    children: [
                      {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?',
                      },
                    ],
                  },
                ],
              },
            },
            rows: [],
            inline: null,
          },
        ],
      },
    ],
  });

  return (
    <CmsLayout title={'CMS'} pageUrls={pageUrls}>
      <AppContentWrapper>
        <Inner>
          <Title>Редактор</Title>
          {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
          {/*@ts-ignore*/}
          <Editor cellPlugins={cellPlugins} value={value} onChange={setValue} />
        </Inner>
      </AppContentWrapper>
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default EditorPage;

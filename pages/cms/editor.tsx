import PageEditor from 'components/PageEditor';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const EditorPage: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout title={'CMS'} pageUrls={pageUrls}>
      <AppContentWrapper>
        <Inner>
          <Title>Редактор</Title>
          <PageEditor
            page={'newPage'}
            onSubmit={(value) => {
              console.log(value);
            }}
            initialValue={{
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
            }}
          />
        </Inner>
      </AppContentWrapper>
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default EditorPage;

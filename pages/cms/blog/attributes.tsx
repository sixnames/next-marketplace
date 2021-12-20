import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import * as React from 'react';
import ContentItemControls from '../../../components/button/ContentItemControls';
import FixedButtons from '../../../components/button/FixedButtons';
import WpButton from '../../../components/button/WpButton';
import Inner from '../../../components/Inner';
import { BlogAttributeModalInterface } from '../../../components/Modal/BlogAttributeModal';
import { ConfirmModalInterface } from '../../../components/Modal/ConfirmModal';
import WpTable, { WpTableColumn } from '../../../components/WpTable';
import WpTitle from '../../../components/WpTitle';
import { DEFAULT_LOCALE, ROUTE_CMS, SORT_ASC } from '../../../config/common';
import { BLOG_ATTRIBUTE_MODAL, CONFIRM_MODAL } from '../../../config/modalVariants';
import { useAppContext } from '../../../context/appContext';
import { COL_BLOG_ATTRIBUTES, COL_OPTIONS_GROUPS } from '../../../db/collectionNames';
import { getDatabase } from '../../../db/mongodb';
import { BlogAttributeInterface } from '../../../db/uiInterfaces';
import { useDeleteBlogAttribute } from '../../../hooks/mutations/useBlogMutations';
import AppContentWrapper from '../../../layout/AppContentWrapper';
import AppSubNav from '../../../layout/AppSubNav';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../../lib/i18n';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../lib/ssrUtils';
import { ClientNavItemInterface } from '../../../types/clientTypes';

interface BlogAttributesListConsumerInterface {
  attributes: BlogAttributeInterface[];
}

const pageTitle = 'Атрибуты блога';

const BlogAttributesListConsumer: React.FC<BlogAttributesListConsumerInterface> = ({
  attributes,
}) => {
  const { showModal } = useAppContext();
  const [deleteBlogAttribute] = useDeleteBlogAttribute();

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Блог',
        testId: 'sub-nav-blog',
        path: `${ROUTE_CMS}/blog`,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: `${ROUTE_CMS}/blog/attributes`,
        exact: true,
      },
    ];
  }, []);

  const columns: WpTableColumn<BlogAttributeInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Заголовок',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'optionsGroup.name',
      headTitle: 'Группа опций',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать блог-пост'}
              updateHandler={() => {
                showModal<BlogAttributeModalInterface>({
                  variant: BLOG_ATTRIBUTE_MODAL,
                  props: {
                    attribute: dataItem,
                  },
                });
              }}
              deleteTitle={'Удалить блог-пост'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    message: `Вы уверенны, что хотите удалить атрибут блога ${dataItem.name}`,
                    confirm: () => {
                      deleteBlogAttribute({
                        _id: `${dataItem._id}`,
                      }).catch(console.log);
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AppContentWrapper testId={'blog-attributes-list'}>
      <Inner lowBottom>
        <WpTitle>{pageTitle}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner>
        <div className='relative'>
          <div className='overflow-x-auto'>
            <WpTable<BlogAttributeInterface>
              testIdKey={'name'}
              columns={columns}
              data={attributes}
              onRowDoubleClick={(dataItem) => {
                showModal<BlogAttributeModalInterface>({
                  variant: BLOG_ATTRIBUTE_MODAL,
                  props: {
                    attribute: dataItem,
                  },
                });
              }}
            />
          </div>

          <FixedButtons>
            <WpButton
              testId={`create-blog-attribute`}
              size={'small'}
              onClick={() => {
                showModal<BlogAttributeModalInterface>({
                  variant: BLOG_ATTRIBUTE_MODAL,
                });
              }}
            >
              Создать атрибут блога
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogAttributesListPageInterface
  extends GetAppInitialDataPropsInterface,
    BlogAttributesListConsumerInterface {}

const BlogAttributesListPage: React.FC<BlogAttributesListPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <BlogAttributesListConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogAttributesListPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const blogAttributesCollection = db.collection<BlogAttributeInterface>(COL_BLOG_ATTRIBUTES);

  const initialBlogAttributesAggregation = await blogAttributesCollection
    .aggregate([
      {
        $sort: {
          [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
        },
      },
      {
        $lookup: {
          as: 'optionsGroup',
          from: COL_OPTIONS_GROUPS,
          let: {
            optionsGroupId: '$optionsGroupId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$optionsGroupId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          optionsGroup: {
            $arrayElemAt: ['$optionsGroup', 0],
          },
        },
      },
    ])
    .toArray();

  const attributes = initialBlogAttributesAggregation.map((attribute) => {
    return {
      ...attribute,
      name: getFieldStringLocale(attribute.nameI18n, props.sessionLocale),
      optionsGroup: attribute.optionsGroup
        ? {
            ...attribute.optionsGroup,
            name: getFieldStringLocale(attribute.optionsGroup.nameI18n, props.sessionLocale),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      attributes: castDbData(attributes),
    },
  };
};

export default BlogAttributesListPage;

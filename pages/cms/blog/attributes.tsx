import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { BlogAttributeModalInterface } from 'components/Modal/BlogAttributeModal';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { BlogAttributeInterface, OptionsGroupInterface } from 'db/uiInterfaces';
import { useDeleteBlogAttribute } from 'hooks/mutations/useBlogMutations';
import { sortObjectsByField } from 'lib/arrayUtils';
import { DEFAULT_LOCALE, SORT_ASC } from 'lib/config/common';
import { BLOG_ATTRIBUTE_MODAL, CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface BlogAttributesListConsumerInterface {
  attributes: BlogAttributeInterface[];
  optionGroups: OptionsGroupInterface[];
}

const pageTitle = 'Атрибуты блога';

const BlogAttributesListConsumer: React.FC<BlogAttributesListConsumerInterface> = ({
  attributes,
  optionGroups,
}) => {
  const { showModal } = useAppContext();
  const [deleteBlogAttribute] = useDeleteBlogAttribute();

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    const links = getProjectLinks();
    return [
      {
        name: 'Блог',
        testId: 'sub-nav-blog',
        path: links.cms.blog.url,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: links.cms.blog.attributes.url,
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
                    optionGroups,
                    attribute: dataItem,
                  },
                });
              }}
              deleteTitle={'Удалить блог-пост'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    message: `Вы уверенны, что хотите удалить атрибут блога ${dataItem.name}?`,
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
                    optionGroups,
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
                  props: {
                    optionGroups,
                  },
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

  const collections = await getDbCollections();
  const blogAttributesCollection = collections.blogAttributesCollection();
  const optionGroupsCollection = collections.optionsGroupsCollection();

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

  const locale = props.sessionLocale;
  const attributes = initialBlogAttributesAggregation.map((attribute) => {
    return {
      ...attribute,
      name: getFieldStringLocale(attribute.nameI18n, locale),
      optionsGroup: attribute.optionsGroup
        ? {
            ...attribute.optionsGroup,
            name: getFieldStringLocale(attribute.optionsGroup.nameI18n, locale),
          }
        : null,
    };
  });

  // option groups
  const initialOptionGroups = await optionGroupsCollection.find({}).toArray();
  const castedOptionGroups = initialOptionGroups.map((document) => {
    return {
      ...document,
      name: getFieldStringLocale(document.nameI18n, locale),
    };
  });
  const sortedOptionGroups = sortObjectsByField(castedOptionGroups);

  return {
    props: {
      ...props,
      attributes: castDbData(attributes),
      optionGroups: castDbData(sortedOptionGroups),
    },
  };
};

export default BlogAttributesListPage;

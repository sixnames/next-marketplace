import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls';
import FixedButtons from 'components/FixedButtons';
import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import { BlogPostModalInterface } from 'components/Modal/BlogPostModal';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { DEFAULT_COMPANY_SLUG, PAGE_STATE_DRAFT, ROUTE_CMS, SORT_DESC } from 'config/common';
import { BLOG_POST_MODAL, CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { COL_BLOG_POSTS, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogPostInterface } from 'db/uiInterfaces';
import { useDeleteBlogPost } from 'hooks/mutations/blog/useBlogMutations';
import AppContentWrapper from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface BlogPostsListConsumerInterface {
  posts: BlogPostInterface[];
}

const pageTitle = 'Блог';

const BlogPostsListConsumer: React.FC<BlogPostsListConsumerInterface> = ({ posts }) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [deleteBlogPost] = useDeleteBlogPost();

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

  const columns: TableColumn<BlogPostInterface>[] = [
    {
      accessor: 'title',
      headTitle: 'Заголовок',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'state',
      headTitle: 'Опубликован',
      render: ({ cellData }) => (cellData === PAGE_STATE_DRAFT ? 'Нет' : 'Да'),
    },
    {
      accessor: 'author.fullName',
      headTitle: 'Автор',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'createdAt',
      headTitle: 'Создан',
      render: ({ cellData }) => {
        return <FormattedDateTime value={cellData} />;
      },
    },
    {
      accessor: 'updatedAt',
      headTitle: 'Обновлён',
      render: ({ cellData }) => {
        return <FormattedDateTime value={cellData} />;
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.title}`}
              updateTitle={'Редактировать блог-пост'}
              updateHandler={() => {
                router.push(`${ROUTE_CMS}/blog/post/${dataItem._id}`).catch(console.log);
              }}
              deleteTitle={'Удалить блог-пост'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    message: `Вы уверенны, что хотите удалить блог-пост ${dataItem.title}`,
                    confirm: () => {
                      deleteBlogPost({
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
    <AppContentWrapper testId={'posts-list'}>
      <Inner lowBottom>
        <Title>{pageTitle}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner>
        <div className='relative'>
          <div className='overflow-x-auto'>
            <Table<BlogPostInterface>
              testIdKey={'title'}
              columns={columns}
              data={posts}
              onRowDoubleClick={(dataItem) => {
                router.push(`${ROUTE_CMS}/blog/post/${dataItem._id}`).catch(console.log);
              }}
            />
          </div>

          <FixedButtons>
            <Button
              testId={`create-blog-post`}
              size={'small'}
              onClick={() => {
                showModal<BlogPostModalInterface>({
                  variant: BLOG_POST_MODAL,
                  props: {
                    companySlug: DEFAULT_COMPANY_SLUG,
                  },
                });
              }}
            >
              Создать блог-пост
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogPostsListPageInterface extends PagePropsInterface, BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({ posts, pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <BlogPostsListConsumer posts={posts} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostsListPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);

  const initialBlogPostsAggregation = await blogPostsCollection
    .aggregate([
      {
        $match: {
          companySlug: DEFAULT_COMPANY_SLUG,
        },
      },
      {
        $sort: {
          updatedAt: SORT_DESC,
          _id: SORT_DESC,
        },
      },
      {
        $lookup: {
          as: 'author',
          from: COL_USERS,
          let: {
            authorId: '$authorId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$authorId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          author: {
            $arrayElemAt: ['$author', 0],
          },
        },
      },
    ])
    .toArray();

  const posts = initialBlogPostsAggregation.map((post) => {
    return {
      ...post,
      title: getFieldStringLocale(post.titleI18n, props.sessionLocale),
      author: post.author
        ? {
            ...post.author,
            fullName: getFullName(post.author),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
    },
  };
};

export default BlogPostsListPage;
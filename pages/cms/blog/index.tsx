import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { ROUTE_CMS, SORT_DESC } from 'config/common';
import { COL_BLOG_POSTS, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogPostInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface BlogPostsListConsumerInterface {
  posts: BlogPostInterface[];
}

const pageTitle = 'Блог';

const BlogPostsListConsumer: React.FC<BlogPostsListConsumerInterface> = ({ posts }) => {
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
              onRowDoubleClick={(dataItem) => console.log(dataItem)}
            />
          </div>

          <FixedButtons>
            <Button
              testId={`create-blog-post`}
              size={'small'}
              onClick={() => {
                console.log('create');
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

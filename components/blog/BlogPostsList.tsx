import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls';
import FixedButtons from 'components/FixedButtons';
import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import { BlogPostModalInterface } from 'components/Modal/BlogPostModal';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { PAGE_STATE_DRAFT } from 'config/common';
import { BLOG_POST_MODAL, CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { BlogPostInterface } from 'db/uiInterfaces';
import { useDeleteBlogPost } from 'hooks/mutations/blog/useBlogMutations';
import AppContentWrapper from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface BlogPostsListInterface {
  posts: BlogPostInterface[];
  pageTitle: string;
  basePath: string;
  companySlug: string;
}

const BlogPostsList: React.FC<BlogPostsListInterface> = ({
  posts,
  companySlug,
  basePath,
  pageTitle,
}) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [deleteBlogPost] = useDeleteBlogPost();

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Блог',
        testId: 'sub-nav-blog',
        path: `${basePath}/blog`,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: `${basePath}/blog/attributes`,
        exact: true,
      },
    ];
  }, [basePath]);

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
                router.push(`${basePath}/blog/post/${dataItem._id}`).catch(console.log);
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
                router.push(`${basePath}/blog/post/${dataItem._id}`).catch(console.log);
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
                    companySlug,
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

export default BlogPostsList;

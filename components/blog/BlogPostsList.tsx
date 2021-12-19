import { useRouter } from 'next/router';
import * as React from 'react';
import { PAGE_STATE_DRAFT, ROUTE_BLOG } from '../../config/common';
import { BLOG_POST_MODAL, CONFIRM_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { BlogPostInterface } from '../../db/uiInterfaces';
import { useDeleteBlogPost } from '../../hooks/mutations/useBlogMutations';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import FormattedDateTime from '../FormattedDateTime';
import { BlogPostModalInterface } from '../Modal/BlogPostModal';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import WpTable, { WpTableColumn } from '../WpTable';

interface BlogPostsListInterface {
  posts: BlogPostInterface[];
  basePath: string;
  companySlug: string;
}

const BlogPostsList: React.FC<BlogPostsListInterface> = ({ posts, companySlug, basePath }) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [deleteBlogPost] = useDeleteBlogPost();

  const columns: WpTableColumn<BlogPostInterface>[] = [
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
                router.push(`${basePath}${ROUTE_BLOG}/post/${dataItem._id}`).catch(console.log);
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
    <div className='relative'>
      <div className='overflow-x-auto'>
        <WpTable<BlogPostInterface>
          testIdKey={'title'}
          columns={columns}
          data={posts}
          onRowDoubleClick={(dataItem) => {
            router.push(`${basePath}${ROUTE_BLOG}/post/${dataItem._id}`).catch(console.log);
          }}
        />
      </div>

      <FixedButtons>
        <WpButton
          testId={`create-blog-post`}
          size={'small'}
          onClick={() => {
            showModal<BlogPostModalInterface>({
              variant: BLOG_POST_MODAL,
              props: {
                basePath,
                companySlug,
              },
            });
          }}
        >
          Создать блог-пост
        </WpButton>
      </FixedButtons>
    </div>
  );
};

export default BlogPostsList;

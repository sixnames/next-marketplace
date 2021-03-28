import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import DataLayoutTitle from 'components/DataLayout/DataLayoutTitle';
import { CreateNewProductModalInterface } from 'components/Modal/CreateNewProductModal/CreateNewProductModal';
import Pager from 'components/Pager/Pager';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table from 'components/Table/Table';
import { ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, CREATE_NEW_PRODUCT_MODAL } from 'config/modals';
import {
  RubricProductFragment,
  useDeleteProductFromRubricMutation,
  useGetRubricProductsQuery,
} from 'generated/apolloComponents';
import { RUBRIC_PRODUCTS_QUERY } from 'graphql/complex/rubricsQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useProductsListColumns from 'hooks/useProductsListColumns';
import AppLayout from 'layout/AppLayout/AppLayout';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const RubricProducts: React.FC = () => {
  const router = useRouter();
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const page = React.useMemo(() => {
    return noNaN(router.query.page) || 1;
  }, [router.query.page]);

  const setPage = React.useCallback(
    (page) => {
      router
        .push(`${ROUTE_CMS}/rubrics/${router.query.rubricSlug}/products/${page}`)
        .catch((e) => console.log(e));
    },
    [router],
  );

  const { data, loading, error, refetch } = useGetRubricProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      rubricSlug: `${router.query.rubricSlug}`,
      productsInput: {
        page,
      },
    },
  });

  const [deleteProductFromRubricMutation] = useDeleteProductFromRubricMutation({
    onCompleted: (data) => {
      onCompleteCallback(data.deleteProductFromRubric);
      refetch({
        rubricSlug: `${router.query.rubricSlug}`,
        productsInput: {
          page,
        },
      }).catch((e) => console.log(e));
    },
    onError: onErrorCallback,
  });

  function deleteProductFromRubricHandler(product: RubricProductFragment) {
    showModal({
      variant: CONFIRM_MODAL,
      props: {
        testId: 'delete-product-from-rubric-modal',
        message: `Вы уверены, что хотите удалить товар ${product.name}?`,
        confirm: () => {
          showLoading();
          return deleteProductFromRubricMutation({
            variables: {
              input: {
                rubricId: `${data?.getRubricBySlug?._id}`,
                productId: product._id,
              },
            },
          });
        },
      },
    });
  }

  function createProductModalHandler() {
    showModal<CreateNewProductModalInterface>({
      variant: CREATE_NEW_PRODUCT_MODAL,
      props: {
        rubricId: `${data?.getRubricBySlug?._id}`,
        refetchQueries: [
          {
            query: RUBRIC_PRODUCTS_QUERY,
            variables: {
              rubricSlug: `${router.query.rubricSlug}`,
              productsInput: {
                page,
              },
            },
          },
        ],
      },
    });
  }

  const columns = useProductsListColumns({
    deleteTitle: 'Удалить товар из рубрики',
    deleteHandler: deleteProductFromRubricHandler,
    updateTitle: 'Редактировать товар',
    updateHandler: ({ _id }) => router.push(`${ROUTE_CMS}/products/${_id}`),
    isDeleteDisabled: ({ rubricId }) => {
      return rubricId !== `${data?.getRubricBySlug?._id}`;
    },
  });

  if (loading) {
    return (
      <DataLayout
        title={'Загрузка...'}
        filterResult={() => {
          return (
            <div data-cy={'rubric-products'}>
              <DataLayoutTitle testId={'rubric-title'}>{`Товары: ----`}</DataLayoutTitle>
              <DataLayoutContentFrame>
                <Spinner isNested />
              </DataLayoutContentFrame>
            </div>
          );
        }}
      />
    );
  }

  if (error || !data || !data.getRubricBySlug) {
    return <RequestError />;
  }

  const {
    getRubricBySlug: { products, name },
  } = data;

  const { docs, totalPages, totalDocs } = products;

  return (
    <DataLayout
      title={name}
      filterResult={() => {
        return (
          <div data-cy={'rubric-products'}>
            <DataLayoutTitle
              testId={'rubric-title'}
              titleRight={
                <ContentItemControls
                  testId={'product'}
                  createTitle={'Добавить товар в рубрику'}
                  createHandler={createProductModalHandler}
                />
              }
            >
              {`Товары: ${totalDocs}`}
            </DataLayoutTitle>

            <DataLayoutContentFrame>
              <Table<RubricProductFragment>
                data={docs}
                columns={columns}
                emptyMessage={'Список пуст'}
                testIdKey={'name'}
              />
              <Pager page={page} setPage={setPage} totalPages={totalPages} />
            </DataLayoutContentFrame>
          </div>
        );
      }}
    />
  );
};

const RubricProductsPage: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <RubricProducts />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default RubricProductsPage;

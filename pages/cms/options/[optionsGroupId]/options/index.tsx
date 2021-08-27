import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { OptionInGroupModalInterface } from 'components/Modal/OptionInGroupModal';
import RequestError from 'components/RequestError';
import Title from 'components/Title';
import { DEFAULT_LOCALE, ROUTE_CMS, SORT_ASC } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { CONFIRM_MODAL, OPTION_IN_GROUP_MODAL } from 'config/modalVariants';
import { COL_ICONS, COL_OPTIONS, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OptionInterface, OptionsGroupInterface } from 'db/uiInterfaces';
import {
  Gender,
  OptionsGroupVariant,
  useAddOptionToGroupMutation,
  useDeleteOptionFromGroupMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionsUtils';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import Image from 'next/image';

interface OptionsGroupOptionsConsumerInterface {
  optionsGroup: OptionsGroupInterface;
}

const OptionsGroupOptionsConsumer: React.FC<OptionsGroupOptionsConsumerInterface> = ({
  optionsGroup,
}) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal, router } =
    useMutationCallbacks({
      reload: true,
      withModal: true,
    });

  const [addOptionToGroupMutation] = useAddOptionToGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.addOptionToGroup),
    onError: onErrorCallback,
  });

  const [deleteOptionFromGroupMutation] = useDeleteOptionFromGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteOptionFromGroup),
    onError: onErrorCallback,
  });

  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Опции',
        testId: 'options',
        path: `${ROUTE_CMS}/options/${optionsGroup._id}/options`,
        exact: true,
      },
      {
        name: 'Детали',
        testId: 'details',
        path: `${ROUTE_CMS}/options/${optionsGroup._id}`,
        exact: true,
      },
    ];
  }, [optionsGroup._id]);

  const renderOptions = React.useCallback(
    (option: OptionInterface) => {
      const { name, options, image } = option;

      return (
        <div>
          {image ? (
            <div>
              <Image
                src={image}
                width={80}
                height={80}
                quality={50}
                alt={`${name}`}
                title={`${name}`}
                objectFit={'contain'}
                objectPosition={'center'}
              />
            </div>
          ) : null}
          <div className='cms-option flex items-center gap-4'>
            {option.icon ? (
              <div
                className='categories-icon-preview'
                dangerouslySetInnerHTML={{ __html: option.icon.icon }}
              />
            ) : null}
            <div className='font-medium' data-cy={`option-${name}`}>
              {name}
            </div>
            <div className='cms-option__controls'>
              <ContentItemControls
                testId={`${name}`}
                justifyContent={'flex-end'}
                createTitle={'Добавить дочернюю опцию'}
                createHandler={() => {
                  showModal<OptionInGroupModalInterface>({
                    variant: OPTION_IN_GROUP_MODAL,
                    props: {
                      groupVariant: `${optionsGroup.variant}` as OptionsGroupVariant,
                      confirm: (values) => {
                        showLoading();
                        return addOptionToGroupMutation({
                          variables: {
                            input: {
                              parentId: option._id,
                              optionsGroupId: optionsGroup._id,
                              ...values,
                              gender: values.gender as Gender,
                            },
                          },
                        });
                      },
                    },
                  });
                }}
                updateTitle={'Редактировать опцию'}
                updateHandler={() => {
                  router
                    .push(`${ROUTE_CMS}/options/${optionsGroup._id}/options/${option._id}`)
                    .catch(console.log);
                }}
                deleteTitle={'Удалить опцию'}
                deleteHandler={() => {
                  showModal<ConfirmModalInterface>({
                    variant: CONFIRM_MODAL,
                    props: {
                      message: `Вы уверенны, что хотите удалить опцию ${name}?`,
                      confirm: () => {
                        showLoading();
                        return deleteOptionFromGroupMutation({
                          variables: {
                            input: {
                              optionsGroupId: `${optionsGroup._id}`,
                              optionId: option._id,
                            },
                          },
                        });
                      },
                    },
                  });
                }}
              />
            </div>
          </div>
          {options && options.length > 0 ? (
            <div className='ml-4'>
              {options.map((option) => (
                <div className='mt-4' key={`${option._id}`}>
                  {renderOptions(option)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    },
    [
      addOptionToGroupMutation,
      deleteOptionFromGroupMutation,
      optionsGroup._id,
      optionsGroup.variant,
      router,
      showLoading,
      showModal,
    ],
  );

  const { options, variant } = optionsGroup;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Опции`,
    config: [
      {
        name: 'Группы опций',
        href: `${ROUTE_CMS}/options`,
      },
      {
        name: `${optionsGroup.name}`,
        href: `${ROUTE_CMS}/options/${optionsGroup._id}`,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{optionsGroup.name}</title>
      </Head>
      <Inner lowBottom>
        <Title>{optionsGroup.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner testId={'options-group-options'}>
        <div className='relative'>
          {!options || options.length < 1 ? (
            <RequestError message={'Список пуст'} />
          ) : (
            <div className='border-t border-border-color'>
              {options.map((option) => (
                <div
                  className='border-b border-border-color py-6 px-inner-block-horizontal-padding'
                  key={`${option._id}`}
                >
                  {renderOptions(option)}
                </div>
              ))}
            </div>
          )}

          <FixedButtons>
            <Button
              testId={'create-top-level-option'}
              size={'small'}
              onClick={() => {
                showModal<OptionInGroupModalInterface>({
                  variant: OPTION_IN_GROUP_MODAL,
                  props: {
                    groupVariant: `${variant}` as OptionsGroupVariant,
                    confirm: (values) => {
                      showLoading();
                      return addOptionToGroupMutation({
                        variables: {
                          input: {
                            optionsGroupId: optionsGroup._id,
                            ...values,
                            gender: values.gender as Gender,
                          },
                        },
                      });
                    },
                  },
                });
              }}
            >
              Добавить родительскую опцию
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface OptionsGroupOptionsPageInterface
  extends PagePropsInterface,
    OptionsGroupOptionsConsumerInterface {}

const OptionsGroupOptionsPage: NextPage<OptionsGroupOptionsPageInterface> = ({
  pageUrls,
  optionsGroup,
}) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <OptionsGroupOptionsConsumer optionsGroup={optionsGroup} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OptionsGroupOptionsPageInterface>> => {
  const { props } = await getAppInitialData({ context });

  if (!props || !context.query.optionsGroupId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const optionsGroupsCollection = await db.collection<OptionsGroupInterface>(COL_OPTIONS_GROUPS);

  const optionsGroupAggregationResult = await optionsGroupsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${context.query.optionsGroupId}`),
        },
      },
      {
        $lookup: {
          from: COL_OPTIONS,
          as: 'options',
          let: { optionsGroupId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$optionsGroupId', '$$optionsGroupId'],
                },
              },
            },
            {
              $lookup: {
                from: COL_ICONS,
                as: 'icon',
                let: {
                  documentId: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      collectionName: COL_OPTIONS,
                      $expr: {
                        $eq: ['$documentId', '$$documentId'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                icon: {
                  $arrayElemAt: ['$icon', 0],
                },
              },
            },
            {
              $sort: {
                [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const optionsGroupResult = optionsGroupAggregationResult[0];

  if (!optionsGroupResult) {
    return {
      notFound: true,
    };
  }

  const optionsGroup: OptionsGroupInterface = {
    ...optionsGroupResult,
    name: getFieldStringLocale(optionsGroupResult.nameI18n, props.sessionLocale),
    options: getTreeFromList<OptionInterface>({
      list: optionsGroupResult.options,
      childrenFieldName: 'options',
    }),
    variantName: getConstantTranslation(
      `selectsOptions.optionsGroupVariant.${optionsGroupResult.variant}.${props.sessionLocale}`,
    ),
  };

  return {
    props: {
      ...props,
      optionsGroup: castDbData(optionsGroup),
    },
  };
};

export default OptionsGroupOptionsPage;

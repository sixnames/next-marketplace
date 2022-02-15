import { ObjectId } from 'mongodb';
import Head from 'next/head';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { MoveOptionModalInterface } from 'components/Modal/MoveOptionModal';
import { OptionInGroupModalInterface } from 'components/Modal/OptionInGroupModal';
import RequestError from 'components/RequestError';
import WpImage from 'components/WpImage';
import WpTitle from 'components/WpTitle';
import { DEFAULT_LOCALE, SORT_ASC } from 'lib/config/common';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { CONFIRM_MODAL, MOVE_OPTION_MODAL, OPTION_IN_GROUP_MODAL } from 'lib/config/modalVariants';
import { COL_ICONS, COL_OPTIONS, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  OptionInterface,
  OptionsGroupInterface,
} from 'db/uiInterfaces';
import {
  Gender,
  OptionsGroupVariant,
  useAddOptionToGroupMutation,
  useDeleteOptionFromGroupMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { getTreeFromList } from 'lib/treeUtils';

interface OptionsGroupOptionsConsumerInterface {
  optionsGroup: OptionsGroupInterface;
  optionGroups: OptionsGroupInterface[];
}

const OptionsGroupOptionsConsumer: React.FC<OptionsGroupOptionsConsumerInterface> = ({
  optionsGroup,
  optionGroups,
}) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
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

  const renderOptions = React.useCallback(
    (option: OptionInterface) => {
      const { name, options, image } = option;
      const optionLinks = getProjectLinks({
        optionsGroupId: optionsGroup._id,
        optionId: option._id,
      });
      const optionUrl = optionLinks.cms.options.optionsGroupId.options.optionId.url;
      return (
        <div data-cy={name} data-url={optionUrl}>
          {image ? (
            <div className='relative mb-4 h-[80px] w-[80px]'>
              <WpImage
                url={image}
                alt={`${name}`}
                title={`${name}`}
                width={80}
                className='absolute inset-0 h-full w-full object-contain'
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
                moveTitle={'Переместить опцию'}
                moveHandler={() => {
                  showModal<MoveOptionModalInterface>({
                    variant: MOVE_OPTION_MODAL,
                    props: {
                      option,
                      optionGroups,
                    },
                  });
                }}
                updateTitle={'Редактировать опцию'}
                updateHandler={() => {
                  window.open(optionUrl, '_blank');
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
      optionGroups,
      addOptionToGroupMutation,
      deleteOptionFromGroupMutation,
      optionsGroup._id,
      optionsGroup.variant,
      showLoading,
      showModal,
    ],
  );

  const { options, variant } = optionsGroup;

  const links = getProjectLinks({
    optionsGroupId: optionsGroup._id,
  });
  const navConfig = [
    {
      name: 'Опции',
      testId: 'options',
      path: links.cms.options.optionsGroupId.options.url,
      exact: true,
    },
    {
      name: 'Детали',
      testId: 'details',
      path: links.cms.options.optionsGroupId.url,
      exact: true,
    },
  ];

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Опции`,
    config: [
      {
        name: 'Группы опций',
        href: links.cms.options.url,
      },
      {
        name: `${optionsGroup.name}`,
        href: links.cms.options.optionsGroupId.url,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{optionsGroup.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{optionsGroup.name}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner testId={'options-group-options'}>
        <div className='relative'>
          {!options || options.length < 1 ? (
            <RequestError message={'Список пуст'} />
          ) : (
            <div className='border-t border-border-300'>
              {options.map((option) => (
                <div
                  className='border-b border-border-300 py-6 px-inner-block-horizontal-padding'
                  key={`${option._id}`}
                >
                  {renderOptions(option)}
                </div>
              ))}
            </div>
          )}

          <FixedButtons>
            <WpButton
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
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface OptionsGroupOptionsPageInterface
  extends GetAppInitialDataPropsInterface,
    OptionsGroupOptionsConsumerInterface {}

const OptionsGroupOptionsPage: NextPage<OptionsGroupOptionsPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <OptionsGroupOptionsConsumer {...props} />
    </ConsoleLayout>
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
  const optionGroupsCollection = await db.collection<OptionsGroupInterface>(COL_OPTIONS_GROUPS);

  const optionsGroupAggregationResult = await optionGroupsCollection
    .aggregate<OptionsGroupInterface>([
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

  const options = getTreeFromList<OptionInterface>({
    list: optionsGroupResult.options,
    childrenFieldName: 'options',
  });

  const optionsGroup: OptionsGroupInterface = {
    ...optionsGroupResult,
    name: getFieldStringLocale(optionsGroupResult.nameI18n, props.sessionLocale),
    options,
    variantName: getConstantTranslation(
      `selectsOptions.optionsGroupVariant.${optionsGroupResult.variant}.${props.sessionLocale}`,
    ),
  };

  // option groups
  const initialOptionGroups = await optionGroupsCollection.find({}).toArray();
  const castedOptionGroups = initialOptionGroups.map((document) => {
    return {
      ...document,
      name: getFieldStringLocale(document.nameI18n, props.sessionLocale),
    };
  });
  const sortedOptionGroups = sortObjectsByField(castedOptionGroups);

  return {
    props: {
      ...props,
      optionsGroup: castDbData(optionsGroup),
      optionGroups: castDbData(sortedOptionGroups),
    },
  };
};

export default OptionsGroupOptionsPage;

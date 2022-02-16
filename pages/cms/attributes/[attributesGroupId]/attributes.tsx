import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useLocaleContext } from 'components/context/localeContext';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { AddAttributeToGroupModalInterface } from 'components/Modal/AttributeInGroupModal';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { MoveAttributeModalInterface } from 'components/Modal/MoveAttributeModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { castAttributeForUI } from 'db/cast/castAttributesGroupForUI';
import { COL_ATTRIBUTES, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  AttributeInterface,
  AttributesGroupInterface,
  MetricInterface,
  OptionsGroupInterface,
} from 'db/uiInterfaces';
import {
  useCreateAttributeMutation,
  useDeleteAttributeMutation,
  useUpdateAttributeMutation,
} from 'hooks/mutations/useAttributeMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { sortObjectsByField } from 'lib/arrayUtils';
import { DEFAULT_LOCALE, SORT_ASC } from 'lib/config/common';
import { getBooleanTranslation, getConstantTranslation } from 'lib/config/constantTranslations';
import {
  ATTRIBUTE_IN_GROUP_MODAL,
  CONFIRM_MODAL,
  MOVE_ATTRIBUTE_MODAL,
} from 'lib/config/modalVariants';
import { getFieldStringLocale } from 'lib/i18n';
import { getCmsLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

const pageTitle = `Группы атрибутов`;

interface AttributesConsumerInterface {
  attributesGroup: AttributesGroupInterface;
  metrics: MetricInterface[];
  optionGroups: OptionsGroupInterface[];
  attributeGroups: AttributesGroupInterface[];
}

const AttributesConsumer: React.FC<AttributesConsumerInterface> = ({
  attributesGroup,
  metrics,
  attributeGroups,
  optionGroups,
}) => {
  const { locale } = useLocaleContext();
  const { showModal } = useMutationCallbacks({
    reload: true,
    withModal: true,
  });

  const [deleteAttributeMutation] = useDeleteAttributeMutation();
  const [updateAttributeMutation] = useUpdateAttributeMutation();
  const [createAttributeMutation] = useCreateAttributeMutation();

  function updateAttributeHandler(attribute: AttributeInterface) {
    showModal<AddAttributeToGroupModalInterface>({
      variant: ATTRIBUTE_IN_GROUP_MODAL,
      props: {
        attribute,
        attributesGroupId: `${attributesGroup._id}`,
        metrics,
        optionGroups,
        confirm: (input) => {
          updateAttributeMutation({
            attributesGroupId: `${attributesGroup._id}`,
            attributeId: `${attribute._id}`,
            ...input,
          }).catch(console.log);
        },
      },
    });
  }

  const links = getCmsLinks({
    attributesGroupId: attributesGroup._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Атрибуты`,
    config: [
      {
        name: 'Группы атрибутов',
        href: links.attributes.parentLink,
      },
      {
        name: `${attributesGroup.name}`,
        href: links.attributes.root,
      },
    ],
  };

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: links.attributes.attribute.parentLink,
        exact: true,
      },
      {
        name: 'Детали',
        testId: 'sub-nav-details',
        path: links.attributes.root,
        exact: true,
      },
    ];
  }, [links]);

  const columns: WpTableColumn<AttributeInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => {
        return (
          <div data-cy={`attribute-${cellData}`} className='whitespace-nowrap'>
            {cellData}
          </div>
        );
      },
    },
    {
      accessor: 'variant',
      headTitle: 'Тип',
      render: ({ cellData }) =>
        getConstantTranslation(`selectsOptions.attributeVariants.${cellData}.${locale}`),
    },
    {
      accessor: 'viewVariant',
      headTitle: 'Тип отображения',
      render: ({ cellData }) =>
        getConstantTranslation(`selectsOptions.attributeView.${cellData}.${locale}`),
    },
    {
      accessor: 'optionsGroup',
      headTitle: 'Опции',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: 'metric',
      headTitle: 'Ед. измерения',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: 'positioningInTitle',
      headTitle: 'Поз-ие в заголове',
      render: ({ cellData }) => {
        if (!cellData) {
          return null;
        }
        return getConstantTranslation(
          `selectsOptions.attributePositioning.${cellData[locale]}.${locale}`,
        );
      },
    },
    {
      accessor: 'capitalise',
      headTitle: 'С заглавной буквы в заголовке',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'notShowAsAlphabet',
      headTitle: 'Не показывать опции атрибута сгруппированными по алфавиту',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showInCard',
      headTitle: 'Показывать в карточке товара',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showAsBreadcrumb',
      headTitle: 'Показывать в крошках карточки товара',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showAsCatalogueBreadcrumb',
      headTitle: 'Показывать в крошках каталога',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showInSnippet',
      headTitle: 'Показывать в сниппете товара',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showNameInTitle',
      headTitle: 'Показывать название атрибута в заголовке каталога',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showNameInSelectedAttributes',
      headTitle: 'Показывать название атрибута в выбраных фильтрах каталога',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      accessor: 'showNameInSnippetTitle',
      headTitle: 'Показывать название атрибута в заголовке сниппета',
      render: ({ cellData }) => {
        return getBooleanTranslation({
          value: cellData,
          locale,
        });
      },
    },
    {
      render: ({ dataItem }) => {
        const { name } = dataItem;
        return (
          <ContentItemControls
            testId={`${name}-attribute`}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать атрибут'}
            updateHandler={() => updateAttributeHandler(dataItem)}
            moveTitle={'Переместить атрибут'}
            moveHandler={() => {
              showModal<MoveAttributeModalInterface>({
                variant: MOVE_ATTRIBUTE_MODAL,
                props: {
                  attributeId: `${dataItem._id}`,
                  attributeGroups,
                },
              });
            }}
            deleteTitle={'Удалить атрибут'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-attribute-modal',
                  message: `Вы уверенны, что хотите удалить атрибут ${name}?`,
                  confirm: () => {
                    return deleteAttributeMutation({
                      attributesGroupId: `${attributesGroup._id}`,
                      attributeId: `${dataItem._id}`,
                    });
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <AppContentWrapper testId={'attributes-list'} breadcrumbs={breadcrumbs}>
      <Head>
        <title>{attributesGroup.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle testId={'attributes-group-title'}>{attributesGroup.name}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />

      <Inner>
        <div className='overflow-x-auto'>
          <WpTable<AttributeInterface>
            testIdKey={'name'}
            columns={columns}
            data={attributesGroup.attributes || []}
            onRowDoubleClick={(dataItem) => updateAttributeHandler(dataItem)}
          />
        </div>

        <FixedButtons>
          <WpButton
            testId={`create-attribute`}
            size={'small'}
            onClick={() => {
              showModal<AddAttributeToGroupModalInterface>({
                variant: ATTRIBUTE_IN_GROUP_MODAL,
                props: {
                  metrics,
                  optionGroups,
                  attributesGroupId: `${attributesGroup._id}`,
                  confirm: (input) => {
                    return createAttributeMutation({
                      attributesGroupId: `${attributesGroup._id}`,
                      ...input,
                    });
                  },
                },
              });
            }}
          >
            Добавить атрибут
          </WpButton>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface AttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    AttributesConsumerInterface {}

const Attributes: NextPage<AttributesPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <AttributesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<AttributesPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });

  if (!props || !query.attributesGroupId) {
    return {
      notFound: true,
    };
  }

  const collections = await getDbCollections();
  const attributesGroupsCollection = collections.attributesGroupsCollection();
  const metricsCollection = collections.metricsCollection();
  const optionGroupsCollection = collections.optionsGroupsCollection();

  const attributesGroupAggregationResult = await attributesGroupsCollection
    .aggregate<AttributesGroupInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.attributesGroupId}`),
        },
      },
      {
        $lookup: {
          from: COL_ATTRIBUTES,
          as: 'attributes',
          let: { attributesGroupId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$attributesGroupId', '$$attributesGroupId'],
                },
              },
            },
            {
              $lookup: {
                from: COL_OPTIONS_GROUPS,
                as: 'optionsGroup',
                let: { optionsGroupId: '$optionsGroupId' },
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

  const rawAttributesGroup = attributesGroupAggregationResult[0];

  if (!rawAttributesGroup) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const attributesGroup = {
    ...rawAttributesGroup,
    name: getFieldStringLocale(rawAttributesGroup.nameI18n, locale),
    attributes: (rawAttributesGroup.attributes || []).map((attribute) => {
      return castAttributeForUI({
        locale,
        attribute,
      });
    }),
  };

  // metrics
  const initialMetrics = await metricsCollection.find({}).toArray();
  const castedMetrics = initialMetrics.map((document) => {
    return {
      ...document,
      name: getFieldStringLocale(document.nameI18n, locale),
    };
  });
  const sortedMetrics = sortObjectsByField(castedMetrics);

  // option groups
  const initialOptionGroups = await optionGroupsCollection.find({}).toArray();
  const castedOptionGroups = initialOptionGroups.map((document) => {
    return {
      ...document,
      name: getFieldStringLocale(document.nameI18n, locale),
    };
  });
  const sortedOptionGroups = sortObjectsByField(castedOptionGroups);

  // attribute groups
  const initialAttributeGroups = await attributesGroupsCollection.find({}).toArray();
  const castedAttributeGroups = initialAttributeGroups.map((document) => {
    return {
      ...document,
      name: getFieldStringLocale(document.nameI18n, locale),
    };
  });
  const sortedAttributeGroups = sortObjectsByField(castedAttributeGroups);

  return {
    props: {
      ...props,
      attributesGroup: castDbData(attributesGroup),
      metrics: castDbData(sortedMetrics),
      optionGroups: castDbData(sortedOptionGroups),
      attributeGroups: castDbData(sortedAttributeGroups),
    },
  };
};

export default Attributes;

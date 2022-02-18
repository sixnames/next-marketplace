import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import { useLocaleContext } from 'components/context/localeContext';
import WpCheckbox from 'components/FormElements/Checkbox/WpCheckbox';
import Inner from 'components/Inner';
import { AddAttributesGroupToRubricModalInterface } from 'components/Modal/AddAttributesGroupToRubricModal';
import WpAccordion from 'components/WpAccordion';
import WpTable, { WpTableColumn } from 'components/WpTable';
import {
  AttributeInterface,
  AttributesGroupInterface,
  EventRubricInterface,
} from 'db/uiInterfaces';
import {
  useAddAttributesGroupToEventRubric,
  useDeleteAttributesGroupFromEventRubric,
  useToggleAttributeInEventRubricFilter,
  useToggleCmsCardAttributeInEventRubric,
} from 'hooks/mutations/useEventRubricMutations';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from 'lib/config/modalVariants';
import * as React from 'react';

export interface EventRubricAttributesInterface {
  rubric: EventRubricInterface;
  attributeGroups: AttributesGroupInterface[];
}

const EventRubricAttributes: React.FC<EventRubricAttributesInterface> = ({
  rubric,
  attributeGroups,
}) => {
  const { locale } = useLocaleContext();
  const { showModal } = useAppContext();

  const [addAttributesGroupToRubricMutation] = useAddAttributesGroupToEventRubric();
  const [deleteAttributesGroupFromRubricMutation] = useDeleteAttributesGroupFromEventRubric();
  const [toggleCmsCardAttributeInRubricMutation] = useToggleCmsCardAttributeInEventRubric();
  const [toggleAttributeInRubricFilterMutation] = useToggleAttributeInEventRubricFilter();

  const columns: WpTableColumn<AttributeInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'variant',
      headTitle: 'Тип',
      render: ({ cellData }) =>
        getConstantTranslation(`selectsOptions.attributeVariants.${cellData}.${locale}`),
    },
    {
      accessor: 'metric',
      headTitle: 'Единица измерения',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      headTitle: 'Показывать в фильтре рубрики',
      render: ({ dataItem }) => {
        const checked = rubric.filterVisibleAttributeIds.includes(dataItem._id);
        return (
          <WpCheckbox
            testId={`${dataItem.name}-filterVisibleAttributeIds`}
            value={dataItem.slug}
            name={dataItem.slug}
            checked={checked}
            onChange={() => {
              toggleAttributeInRubricFilterMutation({
                attributeIds: [`${dataItem._id}`],
                attributesGroupId: `${dataItem.attributesGroupId}`,
                rubricId: `${rubric._id}`,
              }).catch(console.log);
            }}
          />
        );
      },
    },
    {
      accessor: 'cmsCardAttributeIds',
      headTitle: 'Показывать в CMS карточке товара',
      render: ({ cellData, dataItem }) => {
        const checked = rubric.cmsCardAttributeIds.includes(dataItem._id);

        return (
          <WpCheckbox
            testId={`${dataItem.name}-cmsCardAttributeIds`}
            value={cellData}
            name={dataItem.slug}
            checked={checked}
            onChange={() => {
              toggleCmsCardAttributeInRubricMutation({
                attributeIds: [`${dataItem._id}`],
                attributesGroupId: `${dataItem.attributesGroupId}`,
                rubricId: `${rubric._id}`,
              }).catch(console.log);
            }}
          />
        );
      },
    },
  ];

  return (
    <Inner testId={'event-rubric-attributes'}>
      {(rubric.attributesGroups || []).map((attributesGroup) => {
        const { name, attributes, _id } = attributesGroup;
        const allAttributeIds = (attributes || []).map(({ _id }) => `${_id}`);
        const selectedCmsViewInGroup = (rubric.cmsCardAttributeIds || []).filter((_id) => {
          return allAttributeIds.some((attributeId) => `${attributeId}` === `${_id}`);
        });
        const isDeleteAll = selectedCmsViewInGroup.length > 0;
        return (
          <div key={`${_id}`} className='mb-12'>
            <WpAccordion
              isOpen
              title={`${name}`}
              titleRight={
                <div className='flex gap-4'>
                  <WpButton
                    size='small'
                    theme='secondary'
                    onClick={() => {
                      toggleCmsCardAttributeInRubricMutation({
                        attributeIds: isDeleteAll ? [] : allAttributeIds,
                        attributesGroupId: `${attributesGroup._id}`,
                        rubricId: `${rubric._id}`,
                      }).catch(console.log);
                    }}
                  >
                    {`${isDeleteAll ? 'Отключить' : 'Выбрать'} все атрибуты для CMS карточки`}
                  </WpButton>

                  <ContentItemControls
                    testId={`${attributesGroup.name}`}
                    justifyContent={'flex-end'}
                    deleteTitle={'Удалить группу атрибутов из рубрики'}
                    deleteHandler={() => {
                      showModal({
                        variant: CONFIRM_MODAL,
                        props: {
                          testId: 'attributes-group-delete-modal',
                          message: `Вы уверены, что хотите удалить группу атрибутов ${attributesGroup.name} из рубрики?`,
                          confirm: () => {
                            deleteAttributesGroupFromRubricMutation({
                              rubricId: `${rubric._id}`,
                              attributesGroupId: `${attributesGroup._id}`,
                            }).catch(console.log);
                          },
                        },
                      });
                    }}
                  />
                </div>
              }
            >
              <div className={`mt-4 overflow-x-auto`}>
                <WpTable<AttributeInterface>
                  data={attributes}
                  columns={columns}
                  emptyMessage={'Список атрибутов пуст'}
                  testIdKey={'nameString'}
                />
              </div>
            </WpAccordion>
          </div>
        );
      })}

      <FixedButtons>
        <WpButton
          size={'small'}
          testId={'add-attributes-group'}
          onClick={() => {
            showModal<AddAttributesGroupToRubricModalInterface>({
              variant: ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
              props: {
                testId: 'add-attributes-group-to-rubric-modal',
                rubricId: `${rubric._id}`,
                attributeGroups,
                confirm: (values) => {
                  addAttributesGroupToRubricMutation(values).catch(console.log);
                },
              },
            });
          }}
        >
          Добавить группу атрибутов
        </WpButton>
      </FixedButtons>
    </Inner>
  );
};

export default EventRubricAttributes;

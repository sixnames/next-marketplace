import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { CompanyInterface, EventRubricInterface } from 'db/uiInterfaces';
import { useDeleteEventRubric } from 'hooks/mutations/useEventRubricMutations';
import { CONFIRM_MODAL, CREATE_EVENT_RUBRIC_MODAL } from 'lib/config/modalVariants';
import { getConsoleCompanyLinks } from 'lib/links/getProjectLinks';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface EventRubricsListInterface {
  rubrics: EventRubricInterface[];
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const EventRubricsList: React.FC<EventRubricsListInterface> = ({
  rubrics,
  pageCompany,
  routeBasePath,
}) => {
  const { showModal } = useAppContext();
  const router = useRouter();

  const [deleteEventRubricMutation] = useDeleteEventRubric();

  function navigateToTheRubricDetails(dataItem: EventRubricInterface) {
    const links = getConsoleCompanyLinks({
      companyId: pageCompany._id,
      rubricSlug: dataItem.slug,
      basePath: routeBasePath,
    });
    router.push(links.events.rubricSlug.url).catch(console.log);
  }

  const columns: WpTableColumn<EventRubricInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'eventsCount',
      headTitle: 'Всего мероприятий',
      render: ({ cellData, dataItem }) => {
        return <div data-cy={`${dataItem.name}-eventsCount`}>{cellData}</div>;
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать рубрику'}
            updateHandler={() => {
              navigateToTheRubricDetails(dataItem);
            }}
            deleteTitle={'Удалить рубрику'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-event-rubric-modal',
                  message: `Вы уверенны, что хотите удалть рубрику ${dataItem.name}?`,
                  confirm: () => {
                    deleteEventRubricMutation({
                      _id: `${dataItem._id}`,
                    }).catch(console.log);
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
    <Inner testId={'event-rubrics-list'}>
      <div className='overflow-x-auto'>
        <WpTable<EventRubricInterface>
          columns={columns}
          data={rubrics}
          testIdKey={'name'}
          emptyMessage={'Список пуст'}
          onRowDoubleClick={(dataItem) => {
            navigateToTheRubricDetails(dataItem);
          }}
        />
      </div>

      <FixedButtons>
        <WpButton
          testId={'create-event-rubric'}
          size={'small'}
          className={'mt-6 sm:mt-0'}
          onClick={() => {
            showModal({
              variant: CREATE_EVENT_RUBRIC_MODAL,
            });
          }}
        >
          Создать рубрику
        </WpButton>
      </FixedButtons>
    </Inner>
  );
};

export default EventRubricsList;

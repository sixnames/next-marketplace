import AppContentFilter from 'components/AppContentFilter';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import FormattedDateTime from 'components/FormattedDateTime';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import WpLink from 'components/Link/WpLink';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Pager from 'components/Pager';
import RequestError from 'components/RequestError';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { EventSummaryInterface, RubricEventsListInterface } from 'db/uiInterfaces';
import { useDeleteEvent } from 'hooks/mutations/useEventMutations';
import { useBasePath } from 'hooks/useBasePath';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface CompanyEventsInterface extends RubricEventsListInterface {
  showControls: boolean;
}

const CompanyEvents: React.FC<CompanyEventsInterface> = ({
  rubric,
  attributes,
  clearSlug,
  selectedAttributes,
  docs,
  totalDocs,
  page,
  totalPages,
  showControls,
}) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [deleteEventMutation] = useDeleteEvent();
  const routeBasePath = useBasePath('rubricSlug');
  function getEventLink(eventId: string) {
    return `${routeBasePath}/events/event/${eventId}`;
  }

  const columns: WpTableColumn<EventSummaryInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        const link = getEventLink(`${dataItem._id}`);
        if (!showControls) {
          return <div>{dataItem.itemId}</div>;
        }
        return (
          <WpLink testId={`event-link-${rowIndex}`} href={link} target={'_blank'}>
            {dataItem.itemId}
          </WpLink>
        );
      },
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'startAt',
      headTitle: 'Начало',
      render: ({ cellData }) => {
        return <FormattedDateTime value={cellData} />;
      },
    },
    {
      isHidden: !showControls,
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать мероприятие'}
              updateHandler={() => {
                const link = getEventLink(`${dataItem._id}`);
                window.open(link, '_blank');
              }}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-event-modal',
                    message: `Вы уверенны, что хотите удалить мероприятие ${dataItem.name}?`,
                    confirm: () => {
                      deleteEventMutation({
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

  const catalogueCounterString = React.useMemo(() => {
    const counter = noNaN(totalDocs);

    if (counter < 1) {
      return `Найдено ${counter} наименований`;
    }
    const catalogueCounterPostfix = getNumWord(totalDocs, [
      'наименование',
      'наименования',
      'наименований',
    ]);
    return `Найдено ${counter} ${catalogueCounterPostfix}`;
  }, [totalDocs]);

  if (!rubric) {
    return <RequestError />;
  }

  return (
    <Inner testId={'rubric-events-list'}>
      <div className={`mb-2 text-xl font-medium`}>{catalogueCounterString}</div>

      <FormikRouterSearch testId={'events'} />

      <div className={`max-w-full`}>
        <div className={'mb-8'}>
          <AppContentFilter
            basePath={routeBasePath}
            rubricSlug={rubric.slug}
            attributes={attributes}
            selectedAttributes={selectedAttributes}
            clearSlug={clearSlug}
            excludedParams={[rubric.slug]}
          />
        </div>

        <div className={'max-w-full'}>
          <div className={`relative overflow-x-auto overflow-y-hidden`}>
            <WpTable<EventSummaryInterface>
              onRowDoubleClick={(dataItem) => {
                const link = getEventLink(`${dataItem._id}`);
                window.open(link, '_blank');
              }}
              columns={columns}
              data={docs}
              testIdKey={'_id'}
            />
          </div>

          <Pager page={page} totalPages={totalPages} />
        </div>

        {showControls ? (
          <FixedButtons>
            <WpButton
              testId={'create-rubric-event'}
              size={'small'}
              onClick={
                showControls
                  ? () => {
                      router.push(`${routeBasePath}/events/create`).catch(console.log);
                    }
                  : undefined
              }
            >
              Создать мероприятие
            </WpButton>
          </FixedButtons>
        ) : null}
      </div>
    </Inner>
  );
};

export default CompanyEvents;

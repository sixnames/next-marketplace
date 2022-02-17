import AppContentFilter from 'components/AppContentFilter';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import FormattedDateTime from 'components/FormattedDateTime';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import WpLink from 'components/Link/WpLink';
import { CreateEventModalInterface } from 'components/Modal/CreateEventModal';
import Pager from 'components/Pager';
import RequestError from 'components/RequestError';
import WpTable, { WpTableColumn } from 'components/WpTable';
import {
  CompanyInterface,
  EventSummaryInterface,
  RubricEventsListInterface,
} from 'db/uiInterfaces';
import { useDeleteEvent } from 'hooks/mutations/useEventMutations';
import { CREATE_EVENT_MODAL } from 'lib/config/modalVariants';
import { getNumWord } from 'lib/i18n';
import { getConsoleCompanyLinks } from 'lib/links/getProjectLinks';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

export interface CompanyEventsInterface extends RubricEventsListInterface {
  pageCompany: CompanyInterface;
  routeBasePath: string;
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
  routeBasePath,
  pageCompany,
}) => {
  const { showModal } = useAppContext();
  const [deleteEventMutation] = useDeleteEvent();
  function getEventLink(eventId: string) {
    const links = getConsoleCompanyLinks({
      basePath: routeBasePath,
      companyId: pageCompany._id,
      rubricSlug: rubric.slug,
      eventId,
    });
    return links.events.rubricSlug.events.event.eventId.url;
  }

  const columns: WpTableColumn<EventSummaryInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        const link = getEventLink(`${dataItem._id}`);
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
                deleteEventMutation({
                  _id: `${dataItem._id}`,
                }).catch(console.log);
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
    <Inner testId={'rubric-products-list'}>
      <div className={`mb-2 text-xl font-medium`}>{catalogueCounterString}</div>

      <FormikRouterSearch testId={'products'} />

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

        <FixedButtons>
          <WpButton
            size={'small'}
            onClick={() => {
              showModal<CreateEventModalInterface>({
                variant: CREATE_EVENT_MODAL,
                props: {
                  rubric,
                },
              });
            }}
          >
            Создать мероприятие
          </WpButton>
        </FixedButtons>
      </div>
    </Inner>
  );
};

export default CompanyEvents;

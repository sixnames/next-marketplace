import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, EventSummaryInterface } from 'db/uiInterfaces';
import { useDeleteEvent } from 'hooks/mutations/useEventMutations';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getConsoleCompanyLinks } from 'lib/links/getProjectLinks';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

export interface EventLayoutInterface {
  event: EventSummaryInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  routeBasePath: string;
}

const EventLayout: React.FC<EventLayoutInterface> = ({
  event,
  breadcrumbs,
  children,
  routeBasePath,
}) => {
  const { showModal } = useAppContext();
  const links = getConsoleCompanyLinks({
    basePath: routeBasePath,
    companyId: event.companyId,
    rubricSlug: event.rubricSlug,
    eventId: event._id,
  });
  const [deleteEventMutation] = useDeleteEvent({
    reload: false,
    redirectUrl: links.events.rubricSlug.events.url,
  });
  const itemPath = links.events.rubricSlug.events.event.eventId;
  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'details',
      path: itemPath.url,
      exact: true,
    },
    {
      name: 'Атрибуты',
      testId: 'attributes',
      path: itemPath.attributes.url,
      exact: true,
    },
    {
      name: 'Изображения',
      testId: 'assets',
      path: itemPath.assets.url,
      exact: true,
    },
    {
      name: 'Контент карточки',
      testId: 'editor',
      path: itemPath.editor.url,
      exact: true,
    },
  ];

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{event.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle subtitle={`Арт. ${event.itemId}`} testId={`${event.name}-event-title`}>
          {event.name}
        </WpTitle>
        <div className='space-y-6'>
          <div className='mb-4 flex gap-4'>
            <WpButton
              frameClassName='w-auto'
              theme={'secondary'}
              size={'small'}
              onClick={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-event-modal',
                    message: `Вы уверенны, что хотите удалить мероприятие ${event.name}?`,
                    confirm: () => {
                      deleteEventMutation({
                        _id: `${event._id}`,
                      }).catch((e) => console.log(e));
                    },
                  },
                });
              }}
            >
              Удалить мероприятие
            </WpButton>
          </div>
        </div>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default EventLayout;

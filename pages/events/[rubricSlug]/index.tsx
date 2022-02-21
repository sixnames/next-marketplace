import EventsCatalogue, { EventsCatalogueInterface } from 'components/EventsCatalogue';
import { getEventCatalogueProps } from 'db/ssr/catalogue/eventCatalogueUtils';
import { NextPage } from 'next';
import * as React from 'react';

const EventsCataloguePage: NextPage<EventsCatalogueInterface> = (props) => {
  return <EventsCatalogue {...props} />;
};

export const getServerSideProps = getEventCatalogueProps;
export default EventsCataloguePage;

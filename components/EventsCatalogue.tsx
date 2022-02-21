import { SiteLayoutProviderInterface } from 'components/layout/SiteLayout';
import { EventsCatalogueDataInterface } from 'db/uiInterfaces';
import * as React from 'react';

export interface EventsCatalogueInterface extends SiteLayoutProviderInterface {
  catalogueData?: EventsCatalogueDataInterface | null;
  isSearchResult?: boolean;
  noIndexFollow: boolean;
}

const EventsCatalogue: React.FC<EventsCatalogueInterface> = () => {
  return <div>lorem</div>;
};

export default EventsCatalogue;

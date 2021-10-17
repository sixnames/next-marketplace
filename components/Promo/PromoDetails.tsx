import Inner from 'components/Inner';
import { CompanyInterface, PromoInterface } from 'db/uiInterfaces';
import ConsolePromoLayout from 'layout/console/ConsolePromoLayout';
import * as React from 'react';

export interface PromoDetailsInterface {
  promo: PromoInterface;
  basePath: string;
  currentCompany: CompanyInterface;
}

const PromoDetails: React.FC<PromoDetailsInterface> = ({ promo, basePath }) => {
  return (
    <ConsolePromoLayout promo={promo} basePath={basePath}>
      <Inner testId={'promo-details'}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores deleniti dolorum, esse
        est, in inventore itaque laudantium natus nihil nulla odit pariatur perspiciatis porro
        provident quas quo, sint tempora voluptatum.
      </Inner>
    </ConsolePromoLayout>
  );
};

export default PromoDetails;

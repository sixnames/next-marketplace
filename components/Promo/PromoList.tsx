import Inner from 'components/Inner';
import { PromoInterface } from 'db/uiInterfaces';
import * as React from 'react';

export interface PromoListInterface {
  promoList: PromoInterface[];
}

const PromoList: React.FC<PromoListInterface> = ({ promoList }) => {
  console.log(promoList);
  return (
    <Inner testId={'promo-list'}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci ea earum enim hic in
      inventore maiores molestiae nostrum numquam quaerat, quam, quis sint sit. Alias animi impedit
      molestiae recusandae temporibus.
    </Inner>
  );
};

export default PromoList;

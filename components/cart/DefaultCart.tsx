import { CartInterface } from 'db/uiInterfaces';
import { CartTabIndexType } from 'pages/[companySlug]/[citySlug]/cart';
import * as React from 'react';

interface DefaultCartInterface {
  cart: CartInterface;
  tabIndex: CartTabIndexType;
}

const DefaultCart: React.FC<DefaultCartInterface> = ({ cart, tabIndex }) => {
  console.log({ cart, tabIndex });
  return <div>DefaultCart</div>;
};

export default DefaultCart;

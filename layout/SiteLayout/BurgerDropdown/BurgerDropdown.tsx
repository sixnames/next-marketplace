import * as React from 'react';
import Inner from '../../../components/Inner/Inner';
import Link from '../../../components/Link/Link';
import { ROUTE_CMS, ROUTE_APP, ROUTE_PROFILE } from 'config/common';

const BurgerDropdown: React.FC = () => {
  return (
    <div data-cy={'burger-dropdown'}>
      <Inner lowBottom lowTop>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <ul>
                    <li>
                      <Link href={ROUTE_PROFILE}>
                        <span>Личный кабинет</span>
                      </Link>
                    </li>

                    <li>
                      <Link href={ROUTE_CMS}>
                        <span>CMS</span>
                      </Link>
                    </li>

                    <li>
                      <Link href={ROUTE_APP}>
                        <span>Панель управления</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Inner>
    </div>
  );
};

export default BurgerDropdown;

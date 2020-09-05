import React, { useState } from 'react';
import Icon from '../../../components/Icon/Icon';
import classes from './HeaderMobileItem.module.css';
import Link from 'next/link';
import { HeaderRubricInterface } from './Header';

interface HeaderMobileItemInterface {
  rubric: HeaderRubricInterface;
  hideNav: () => void;
}

// TODO active class
const HeaderMobileItem: React.FC<HeaderMobileItemInterface> = ({ rubric, hideNav }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { nameString, slug, children = [] } = rubric;

  function toggleDropdownHandler() {
    setIsOpen((prevState) => !prevState);
  }

  return (
    <li className={classes.frame}>
      <Link
        href={{
          pathname: `/[...catalogue]`,
        }}
        as={{
          pathname: `/${slug}`,
        }}
      >
        <a onClick={hideNav} className={classes.link}>
          {nameString}
        </a>
      </Link>

      <div
        onClick={toggleDropdownHandler}
        className={`${classes.trigger} ${isOpen ? classes.triggerActive : ''}`}
      >
        <Icon name={'chevron-down'} />
      </div>

      {isOpen && (
        <ul className={classes.dropdown}>
          {children.map(({ nameString, slug, id }) => (
            <li className={classes.dropdownItem} key={id}>
              <Link
                href={{
                  pathname: `/[...catalogue]`,
                }}
                as={{
                  pathname: `/${slug}`,
                }}
              >
                <a onClick={hideNav} className={`${classes.mainRubricsItem}`}>
                  {nameString}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default HeaderMobileItem;

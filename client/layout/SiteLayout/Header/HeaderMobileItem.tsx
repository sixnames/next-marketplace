import React, { useState } from 'react';
import Icon from '../../../components/Icon/Icon';
import classes from './HeaderMobileItem.module.css';
import Link from 'next/link';

interface RubricInterface {
  id: string;
  name: string;
  slug: string;
  children?: RubricInterface[];
}

interface HeaderMobileItemInterface {
  rubric: RubricInterface;
  hideNav: () => void;
}

// TODO active class
const HeaderMobileItem: React.FC<HeaderMobileItemInterface> = ({ rubric, hideNav }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { name, slug, children = [], id } = rubric;

  function toggleDropdownHandler() {
    setIsOpen((prevState) => !prevState);
  }

  return (
    <li className={classes.frame}>
      <Link
        href={{
          pathname: `/[catalogue]`,
          query: { id: `${id}` },
        }}
        as={{
          pathname: `/${slug}`,
          query: { id: `${id}` },
        }}
      >
        <a onClick={hideNav} className={classes.link}>
          {name}
        </a>
      </Link>

      <div
        onClick={toggleDropdownHandler}
        className={`${classes.trigger} ${isOpen ? classes.triggerActive : ''}`}
      >
        <Icon name={'ExpandMore'} />
      </div>

      {isOpen && (
        <ul className={classes.dropdown}>
          {children.map(({ name, slug, id }) => (
            <li className={classes.dropdownItem} key={id}>
              <Link
                href={{
                  pathname: `/[catalogue]`,
                  query: { id: `${id}` },
                }}
                as={{
                  pathname: `/${slug}`,
                  query: { id: `${id}` },
                }}
              >
                <a onClick={hideNav} className={`${classes.mainRubricsItem}`}>
                  {name}
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

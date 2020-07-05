import React, { useState } from 'react';
import Icon from '../../../components/Icon/Icon';
import Link from '../../../components/Link/Link';
import classes from './HeaderMobileItem.module.css';

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

const HeaderMobileItem: React.FC<HeaderMobileItemInterface> = ({ rubric, hideNav }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { name, slug, children = [] } = rubric;

  function toggleDropdownHandler() {
    setIsOpen((prevState) => !prevState);
  }

  return (
    <li className={classes.frame}>
      <Link
        href={slug}
        onClick={hideNav}
        activeClassName={classes.linkCurrent}
        className={classes.link}
      >
        {name}
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
                href={slug}
                onClick={hideNav}
                activeClassName={classes.linkCurrent}
                className={classes.dropdownLink}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default HeaderMobileItem;

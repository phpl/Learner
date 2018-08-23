import React from 'react';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from '../header-components';

export const AppMenu = props => (
  // tslint:disable-next-line:jsx-self-close
  <NavDropdown icon="chalkboard-teacher" name={translate('global.menu.app.main')} id="entity-menu">
    <DropdownItem tag={Link} to="/flashcards/card">
      <FontAwesomeIcon icon="asterisk" />&nbsp;<Translate contentKey="global.menu.app.card" />
    </DropdownItem>
  </NavDropdown>
);

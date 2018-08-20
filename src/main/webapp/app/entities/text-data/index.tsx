import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TextData from './text-data';
import TextDataDetail from './text-data-detail';
import TextDataUpdate from './text-data-update';
import TextDataDeleteDialog from './text-data-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TextDataUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TextDataUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TextDataDetail} />
      <ErrorBoundaryRoute path={match.url} component={TextData} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={TextDataDeleteDialog} />
  </>
);

export default Routes;

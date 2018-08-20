import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ImageData from './image-data';
import ImageDataDetail from './image-data-detail';
import ImageDataUpdate from './image-data-update';
import ImageDataDeleteDialog from './image-data-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ImageDataUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ImageDataUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ImageDataDetail} />
      <ErrorBoundaryRoute path={match.url} component={ImageData} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ImageDataDeleteDialog} />
  </>
);

export default Routes;

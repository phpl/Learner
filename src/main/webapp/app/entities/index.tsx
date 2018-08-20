import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Tag from './tag';
import Card from './card';
import TextData from './text-data';
import ImageData from './image-data';
import CardInfo from './card-info';
import UserExtra from './user-extra';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/tag`} component={Tag} />
      <ErrorBoundaryRoute path={`${match.url}/card`} component={Card} />
      <ErrorBoundaryRoute path={`${match.url}/text-data`} component={TextData} />
      <ErrorBoundaryRoute path={`${match.url}/image-data`} component={ImageData} />
      <ErrorBoundaryRoute path={`${match.url}/card-info`} component={CardInfo} />
      <ErrorBoundaryRoute path={`${match.url}/user-extra`} component={UserExtra} />
      {/* jhipster-needle-add-route-path - JHipster will routes here */}
    </Switch>
  </div>
);

export default Routes;

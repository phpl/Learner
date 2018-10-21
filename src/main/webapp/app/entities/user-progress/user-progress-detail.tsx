import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './user-progress.reducer';
import { IUserProgress } from 'app/shared/model/user-progress.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUserProgressDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class UserProgressDetail extends React.Component<IUserProgressDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { userProgressEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="learnerappApp.userProgress.detail.title">UserProgress</Translate> [<b>{userProgressEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="day">
                <Translate contentKey="learnerappApp.userProgress.day">Day</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={userProgressEntity.day} type="date" format={APP_LOCAL_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="dailyRepetitions">
                <Translate contentKey="learnerappApp.userProgress.dailyRepetitions">Daily Repetitions</Translate>
              </span>
            </dt>
            <dd>{userProgressEntity.dailyRepetitions}</dd>
            <dt>
              <Translate contentKey="learnerappApp.userProgress.userExtra">User Extra</Translate>
            </dt>
            <dd>{userProgressEntity.userExtra ? userProgressEntity.userExtra.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/user-progress" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/user-progress/${userProgressEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ userProgress }: IRootState) => ({
  userProgressEntity: userProgress.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProgressDetail);

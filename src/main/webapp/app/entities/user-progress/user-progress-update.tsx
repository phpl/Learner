import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUserExtra } from 'app/shared/model/user-extra.model';
import { getEntities as getUserExtras } from 'app/entities/user-extra/user-extra.reducer';
import { getEntity, updateEntity, createEntity, reset } from './user-progress.reducer';
import { IUserProgress } from 'app/shared/model/user-progress.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface IUserProgressUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface IUserProgressUpdateState {
  isNew: boolean;
  userExtraId: number;
}

export class UserProgressUpdate extends React.Component<IUserProgressUpdateProps, IUserProgressUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      userExtraId: 0,
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getUserExtras();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { userProgressEntity } = this.props;
      const entity = {
        ...userProgressEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
      this.handleClose();
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/user-progress');
  };

  userExtraUpdate = element => {
    const id = element.target.value.toString();
    if (id === '') {
      this.setState({
        userExtraId: -1
      });
    } else {
      for (const i in this.props.userExtras) {
        if (id === this.props.userExtras[i].id.toString()) {
          this.setState({
            userExtraId: this.props.userExtras[i].id
          });
        }
      }
    }
  };

  render() {
    const { userProgressEntity, userExtras, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="learnerappApp.userProgress.home.createOrEditLabel">
              <Translate contentKey="learnerappApp.userProgress.home.createOrEditLabel">Create or edit a UserProgress</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : userProgressEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="user-progress-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="dayLabel" for="day">
                    <Translate contentKey="learnerappApp.userProgress.day">Day</Translate>
                  </Label>
                  <AvField id="user-progress-day" type="date" className="form-control" name="day" />
                </AvGroup>
                <AvGroup>
                  <Label id="dailyRepetitionsLabel" for="dailyRepetitions">
                    <Translate contentKey="learnerappApp.userProgress.dailyRepetitions">Daily Repetitions</Translate>
                  </Label>
                  <AvField id="user-progress-dailyRepetitions" type="number" className="form-control" name="dailyRepetitions" />
                </AvGroup>
                <AvGroup>
                  <Label for="userExtra.id">
                    <Translate contentKey="learnerappApp.userProgress.userExtra">User Extra</Translate>
                  </Label>
                  <AvInput
                    id="user-progress-userExtra"
                    type="select"
                    className="form-control"
                    name="userExtra.id"
                    onChange={this.userExtraUpdate}
                  >
                    <option value="" key="0" />
                    {userExtras
                      ? userExtras.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/user-progress" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  userExtras: storeState.userExtra.entities,
  userProgressEntity: storeState.userProgress.entity,
  loading: storeState.userProgress.loading,
  updating: storeState.userProgress.updating
});

const mapDispatchToProps = {
  getUserExtras,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProgressUpdate);

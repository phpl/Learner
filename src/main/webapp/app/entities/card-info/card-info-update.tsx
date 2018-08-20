import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ICard } from 'app/shared/model/card.model';
import { getEntities as getCards } from 'app/entities/card/card.reducer';
import { getEntity, updateEntity, createEntity, reset } from './card-info.reducer';
import { ICardInfo } from 'app/shared/model/card-info.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface ICardInfoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface ICardInfoUpdateState {
  isNew: boolean;
  cardId: number;
}

export class CardInfoUpdate extends React.Component<ICardInfoUpdateProps, ICardInfoUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      cardId: 0,
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getCards();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { cardInfoEntity } = this.props;
      const entity = {
        ...cardInfoEntity,
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
    this.props.history.push('/entity/card-info');
  };

  render() {
    const { cardInfoEntity, cards, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="learnerappApp.cardInfo.home.createOrEditLabel">
              <Translate contentKey="learnerappApp.cardInfo.home.createOrEditLabel">Create or edit a CardInfo</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : cardInfoEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="card-info-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="repetitionsLabel" for="repetitions">
                    <Translate contentKey="learnerappApp.cardInfo.repetitions">Repetitions</Translate>
                  </Label>
                  <AvField id="card-info-repetitions" type="number" className="form-control" name="repetitions" />
                </AvGroup>
                <AvGroup>
                  <Label id="difficultyLabel" for="difficulty">
                    <Translate contentKey="learnerappApp.cardInfo.difficulty">Difficulty</Translate>
                  </Label>
                  <AvField
                    id="card-info-difficulty"
                    type="number"
                    className="form-control"
                    name="difficulty"
                    validate={{
                      min: { value: 0, errorMessage: translate('entity.validation.min', { min: 0 }) },
                      max: { value: 1, errorMessage: translate('entity.validation.max', { max: 1 }) },
                      number: { value: true, errorMessage: translate('entity.validation.number') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="daysBetweenReviewsLabel" for="daysBetweenReviews">
                    <Translate contentKey="learnerappApp.cardInfo.daysBetweenReviews">Days Between Reviews</Translate>
                  </Label>
                  <AvField id="card-info-daysBetweenReviews" type="number" className="form-control" name="daysBetweenReviews" />
                </AvGroup>
                <AvGroup>
                  <Label id="dateLastReviewedLabel" for="dateLastReviewed">
                    <Translate contentKey="learnerappApp.cardInfo.dateLastReviewed">Date Last Reviewed</Translate>
                  </Label>
                  <AvField id="card-info-dateLastReviewed" type="date" className="form-control" name="dateLastReviewed" />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/card-info" replace color="info">
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
  cards: storeState.card.entities,
  cardInfoEntity: storeState.cardInfo.entity,
  loading: storeState.cardInfo.loading,
  updating: storeState.cardInfo.updating
});

const mapDispatchToProps = {
  getCards,
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
)(CardInfoUpdate);

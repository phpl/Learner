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
import { getEntity, updateEntity, createEntity, reset } from './text-data.reducer';
import { ITextData } from 'app/shared/model/text-data.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface ITextDataUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface ITextDataUpdateState {
  isNew: boolean;
  cardId: number;
}

export class TextDataUpdate extends React.Component<ITextDataUpdateProps, ITextDataUpdateState> {
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
      const { textDataEntity } = this.props;
      const entity = {
        ...textDataEntity,
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
    this.props.history.push('/entity/text-data');
  };

  render() {
    const { textDataEntity, cards, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="learnerappApp.textData.home.createOrEditLabel">
              <Translate contentKey="learnerappApp.textData.home.createOrEditLabel">Create or edit a TextData</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : textDataEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="text-data-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="frontTextLabel" for="frontText">
                    <Translate contentKey="learnerappApp.textData.frontText">Front Text</Translate>
                  </Label>
                  <AvField id="text-data-frontText" type="text" name="frontText" />
                </AvGroup>
                <AvGroup>
                  <Label id="backTextLabel" for="backText">
                    <Translate contentKey="learnerappApp.textData.backText">Back Text</Translate>
                  </Label>
                  <AvField id="text-data-backText" type="text" name="backText" />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/text-data" replace color="info">
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
  textDataEntity: storeState.textData.entity,
  loading: storeState.textData.loading,
  updating: storeState.textData.updating
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
)(TextDataUpdate);

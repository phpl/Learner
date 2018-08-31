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
import { getEntitiesForLoggedUser as getCards } from 'app/entities/card/card.reducer';
import { getEntity, updateEntityForLoggedUser, createEntityForLoggedUser, reset } from 'app/entities/category/category.reducer';
import { ICategory } from 'app/shared/model/category.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface ICategoryUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface ICategoryUpdateState {
  isNew: boolean;
  cardId: number;
}

export class CategoryUpdate extends React.Component<ICategoryUpdateProps, ICategoryUpdateState> {
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
      const { categoryEntity } = this.props;
      const entity = {
        ...categoryEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntityForLoggedUser(entity);
      } else {
        this.props.updateEntityForLoggedUser(entity);
      }
      this.handleClose();
    }
  };

  handleClose = () => {
    this.props.history.push('/flashcards/category');
  };

  render() {
    const { categoryEntity, cards, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="learnerappApp.category.home.createOrEditLabel">
              <Translate contentKey="learnerappApp.category.home.createOrEditLabel">Create or edit a Category</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : categoryEntity} onSubmit={this.saveEntity}>
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    <Translate contentKey="learnerappApp.category.name">Name</Translate>
                  </Label>
                  <AvField
                    id="category-name"
                    type="text"
                    name="name"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/flashcards/category" replace color="info">
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
  categoryEntity: storeState.category.entity,
  loading: storeState.category.loading,
  updating: storeState.category.updating
});

const mapDispatchToProps = {
  getCards,
  getEntity,
  updateEntityForLoggedUser,
  createEntityForLoggedUser,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryUpdate);

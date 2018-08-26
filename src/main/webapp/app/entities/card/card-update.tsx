import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ICategory } from 'app/shared/model/category.model';
import { getEntities as getCategories } from 'app/entities/category/category.reducer';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { getEntities as getUserExtras } from 'app/entities/user-extra/user-extra.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './card.reducer';
import { ICard } from 'app/shared/model/card.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface ICardUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface ICardUpdateState {
  isNew: boolean;
  categoryId: number;
  userExtraId: number;
}

export class CardUpdate extends React.Component<ICardUpdateProps, ICardUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: 0,
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

    this.props.getCategories();
    this.props.getUserExtras();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { cardEntity } = this.props;
      const entity = {
        ...cardEntity,
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
    this.props.history.push('/entity/card');
  };

  categoryUpdate = element => {
    const name = element.target.value.toString();
    if (name === '') {
      this.setState({
        categoryId: -1
      });
    } else {
      for (const i in this.props.categories) {
        if (name === this.props.categories[i].name.toString()) {
          this.setState({
            categoryId: this.props.categories[i].id
          });
        }
      }
    }
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
    const { cardEntity, categories, userExtras, loading, updating } = this.props;
    const { isNew } = this.state;

    const { frontImage, frontImageContentType, backImage, backImageContentType } = cardEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="learnerappApp.card.home.createOrEditLabel">
              <Translate contentKey="learnerappApp.card.home.createOrEditLabel">Create or edit a Card</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : cardEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="card-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="frontTextLabel" for="frontText">
                    <Translate contentKey="learnerappApp.card.frontText">Front Text</Translate>
                  </Label>
                  <AvField id="card-frontText" type="text" name="frontText" />
                </AvGroup>
                <AvGroup>
                  <Label id="backTextLabel" for="backText">
                    <Translate contentKey="learnerappApp.card.backText">Back Text</Translate>
                  </Label>
                  <AvField id="card-backText" type="text" name="backText" />
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="frontImageLabel" for="frontImage">
                      <Translate contentKey="learnerappApp.card.frontImage">Front Image</Translate>
                    </Label>
                    <br />
                    {frontImage ? (
                      <div>
                        <a onClick={openFile(frontImageContentType, frontImage)}>
                          <img src={`data:${frontImageContentType};base64,${frontImage}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {frontImageContentType}, {byteSize(frontImage)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('frontImage')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_frontImage" type="file" onChange={this.onBlobChange(true, 'frontImage')} accept="image/*" />
                    <AvInput type="hidden" name="frontImage" value={frontImage} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="backImageLabel" for="backImage">
                      <Translate contentKey="learnerappApp.card.backImage">Back Image</Translate>
                    </Label>
                    <br />
                    {backImage ? (
                      <div>
                        <a onClick={openFile(backImageContentType, backImage)}>
                          <img src={`data:${backImageContentType};base64,${backImage}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {backImageContentType}, {byteSize(backImage)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('backImage')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_backImage" type="file" onChange={this.onBlobChange(true, 'backImage')} accept="image/*" />
                    <AvInput type="hidden" name="backImage" value={backImage} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <Label id="repetitionsLabel" for="repetitions">
                    <Translate contentKey="learnerappApp.card.repetitions">Repetitions</Translate>
                  </Label>
                  <AvField id="card-repetitions" type="number" className="form-control" name="repetitions" />
                </AvGroup>
                <AvGroup>
                  <Label id="difficultyLabel" for="difficulty">
                    <Translate contentKey="learnerappApp.card.difficulty">Difficulty</Translate>
                  </Label>
                  <AvField
                    id="card-difficulty"
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
                    <Translate contentKey="learnerappApp.card.daysBetweenReviews">Days Between Reviews</Translate>
                  </Label>
                  <AvField id="card-daysBetweenReviews" type="number" className="form-control" name="daysBetweenReviews" />
                </AvGroup>
                <AvGroup>
                  <Label id="dateLastReviewedLabel" for="dateLastReviewed">
                    <Translate contentKey="learnerappApp.card.dateLastReviewed">Date Last Reviewed</Translate>
                  </Label>
                  <AvField id="card-dateLastReviewed" type="date" className="form-control" name="dateLastReviewed" />
                </AvGroup>
                <AvGroup>
                  <Label for="category.name">
                    <Translate contentKey="learnerappApp.card.category">Category</Translate>
                  </Label>
                  <AvInput id="card-category" type="select" className="form-control" name="category.name" onChange={this.categoryUpdate}>
                    <option value="" key="0" />
                    {categories
                      ? categories.map(otherEntity => (
                          <option value={otherEntity.name} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="userExtra.id">
                    <Translate contentKey="learnerappApp.card.userExtra">User Extra</Translate>
                  </Label>
                  <AvInput id="card-userExtra" type="select" className="form-control" name="userExtra.id" onChange={this.userExtraUpdate}>
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
                <Button tag={Link} id="cancel-save" to="/entity/card" replace color="info">
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
  categories: storeState.category.entities,
  userExtras: storeState.userExtra.entities,
  cardEntity: storeState.card.entity,
  loading: storeState.card.loading,
  updating: storeState.card.updating
});

const mapDispatchToProps = {
  getCategories,
  getUserExtras,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardUpdate);

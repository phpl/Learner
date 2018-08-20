import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITextData } from 'app/shared/model/text-data.model';
import { getEntities as getTextData } from 'app/entities/text-data/text-data.reducer';
import { IImageData } from 'app/shared/model/image-data.model';
import { getEntities as getImageData } from 'app/entities/image-data/image-data.reducer';
import { ICardInfo } from 'app/shared/model/card-info.model';
import { getEntities as getCardInfos } from 'app/entities/card-info/card-info.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { getEntities as getTags } from 'app/entities/tag/tag.reducer';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { getEntities as getUserExtras } from 'app/entities/user-extra/user-extra.reducer';
import { getEntity, updateEntity, createEntity, reset } from './card.reducer';
import { ICard } from 'app/shared/model/card.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface ICardUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface ICardUpdateState {
  isNew: boolean;
  idstag: any[];
  textDataId: number;
  imageDataId: number;
  cardInfoId: number;
  userExtraId: number;
}

export class CardUpdate extends React.Component<ICardUpdateProps, ICardUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      idstag: [],
      textDataId: 0,
      imageDataId: 0,
      cardInfoId: 0,
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

    this.props.getTextData();
    this.props.getImageData();
    this.props.getCardInfos();
    this.props.getTags();
    this.props.getUserExtras();
  }

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

  textDataUpdate = element => {
    const id = element.target.value.toString();
    if (id === '') {
      this.setState({
        textDataId: -1
      });
    } else {
      for (const i in this.props.textData) {
        if (id === this.props.textData[i].id.toString()) {
          this.setState({
            textDataId: this.props.textData[i].id
          });
        }
      }
    }
  };

  imageDataUpdate = element => {
    const id = element.target.value.toString();
    if (id === '') {
      this.setState({
        imageDataId: -1
      });
    } else {
      for (const i in this.props.imageData) {
        if (id === this.props.imageData[i].id.toString()) {
          this.setState({
            imageDataId: this.props.imageData[i].id
          });
        }
      }
    }
  };

  cardInfoUpdate = element => {
    const id = element.target.value.toString();
    if (id === '') {
      this.setState({
        cardInfoId: -1
      });
    } else {
      for (const i in this.props.cardInfos) {
        if (id === this.props.cardInfos[i].id.toString()) {
          this.setState({
            cardInfoId: this.props.cardInfos[i].id
          });
        }
      }
    }
  };

  tagUpdate = element => {
    const selected = Array.from(element.target.selectedOptions).map((e: any) => parseInt(e.value, 10));
    this.setState({
      idstag: keysToValues(selected, this.props.tags, 'id')
    });
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

  displaytag(value: any) {
    if (this.state.idstag && this.state.idstag.length !== 0) {
      const list = [];
      for (const i in this.state.idstag) {
        if (this.state.idstag[i]) {
          list.push(this.state.idstag[i].id);
        }
      }
      return list;
    }
    if (value.tags && value.tags.length !== 0) {
      const list = [];
      for (const i in value.tags) {
        if (value.tags[i]) {
          list.push(value.tags[i].id);
        }
      }
      this.setState({
        idstag: keysToValues(list, this.props.tags, 'id')
      });
      return list;
    }
    return null;
  }

  render() {
    const { cardEntity, textData, imageData, cardInfos, tags, userExtras, loading, updating } = this.props;
    const { isNew } = this.state;

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
                  <Label for="textData.id">
                    <Translate contentKey="learnerappApp.card.textData">Text Data</Translate>
                  </Label>
                  <AvInput
                    id="card-textData"
                    type="select"
                    className="form-control"
                    name="textData.id"
                    onChange={this.textDataUpdate}
                    value={isNew && textData ? textData[0] && textData[0].id : ''}
                  >
                    <option value="" key="0" />
                    {textData
                      ? textData.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="imageData.id">
                    <Translate contentKey="learnerappApp.card.imageData">Image Data</Translate>
                  </Label>
                  <AvInput
                    id="card-imageData"
                    type="select"
                    className="form-control"
                    name="imageData.id"
                    onChange={this.imageDataUpdate}
                    value={isNew && imageData ? imageData[0] && imageData[0].id : ''}
                  >
                    <option value="" key="0" />
                    {imageData
                      ? imageData.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="cardInfo.id">
                    <Translate contentKey="learnerappApp.card.cardInfo">Card Info</Translate>
                  </Label>
                  <AvInput
                    id="card-cardInfo"
                    type="select"
                    className="form-control"
                    name="cardInfo.id"
                    onChange={this.cardInfoUpdate}
                    value={isNew && cardInfos ? cardInfos[0] && cardInfos[0].id : ''}
                  >
                    <option value="" key="0" />
                    {cardInfos
                      ? cardInfos.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="tags">
                    <Translate contentKey="learnerappApp.card.tag">Tag</Translate>
                  </Label>
                  <AvInput
                    id="card-tag"
                    type="select"
                    multiple
                    className="form-control"
                    name="faketags"
                    value={this.displaytag(cardEntity)}
                    onChange={this.tagUpdate}
                  >
                    <option value="" key="0" />
                    {tags
                      ? tags.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                  <AvInput id="card-tag" type="hidden" name="tags" value={this.state.idstag} />
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
  textData: storeState.textData.entities,
  imageData: storeState.imageData.entities,
  cardInfos: storeState.cardInfo.entities,
  tags: storeState.tag.entities,
  userExtras: storeState.userExtra.entities,
  cardEntity: storeState.card.entity,
  loading: storeState.card.loading,
  updating: storeState.card.updating
});

const mapDispatchToProps = {
  getTextData,
  getImageData,
  getCardInfos,
  getTags,
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
)(CardUpdate);

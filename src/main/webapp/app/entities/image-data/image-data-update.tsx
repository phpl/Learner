import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ICard } from 'app/shared/model/card.model';
import { getEntities as getCards } from 'app/entities/card/card.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './image-data.reducer';
import { IImageData } from 'app/shared/model/image-data.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface IImageDataUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface IImageDataUpdateState {
  isNew: boolean;
  cardId: number;
}

export class ImageDataUpdate extends React.Component<IImageDataUpdateProps, IImageDataUpdateState> {
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

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { imageDataEntity } = this.props;
      const entity = {
        ...imageDataEntity,
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
    this.props.history.push('/entity/image-data');
  };

  render() {
    const { imageDataEntity, cards, loading, updating } = this.props;
    const { isNew } = this.state;

    const { frontImage, frontImageContentType, backImage, backImageContentType } = imageDataEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="learnerappApp.imageData.home.createOrEditLabel">
              <Translate contentKey="learnerappApp.imageData.home.createOrEditLabel">Create or edit a ImageData</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : imageDataEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="image-data-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <AvGroup>
                    <Label id="frontImageLabel" for="frontImage">
                      <Translate contentKey="learnerappApp.imageData.frontImage">Front Image</Translate>
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
                      <Translate contentKey="learnerappApp.imageData.backImage">Back Image</Translate>
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
                <Button tag={Link} id="cancel-save" to="/entity/image-data" replace color="info">
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
  imageDataEntity: storeState.imageData.entity,
  loading: storeState.imageData.loading,
  updating: storeState.imageData.updating
});

const mapDispatchToProps = {
  getCards,
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
)(ImageDataUpdate);

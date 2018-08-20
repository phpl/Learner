import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './image-data.reducer';
import { IImageData } from 'app/shared/model/image-data.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IImageDataDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class ImageDataDetail extends React.Component<IImageDataDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { imageDataEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="learnerappApp.imageData.detail.title">ImageData</Translate> [<b>{imageDataEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="frontImage">
                <Translate contentKey="learnerappApp.imageData.frontImage">Front Image</Translate>
              </span>
            </dt>
            <dd>
              {imageDataEntity.frontImage ? (
                <div>
                  <a onClick={openFile(imageDataEntity.frontImageContentType, imageDataEntity.frontImage)}>
                    <img
                      src={`data:${imageDataEntity.frontImageContentType};base64,${imageDataEntity.frontImage}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                  <span>
                    {imageDataEntity.frontImageContentType}, {byteSize(imageDataEntity.frontImage)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <span id="backImage">
                <Translate contentKey="learnerappApp.imageData.backImage">Back Image</Translate>
              </span>
            </dt>
            <dd>
              {imageDataEntity.backImage ? (
                <div>
                  <a onClick={openFile(imageDataEntity.backImageContentType, imageDataEntity.backImage)}>
                    <img
                      src={`data:${imageDataEntity.backImageContentType};base64,${imageDataEntity.backImage}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                  <span>
                    {imageDataEntity.backImageContentType}, {byteSize(imageDataEntity.backImage)}
                  </span>
                </div>
              ) : null}
            </dd>
          </dl>
          <Button tag={Link} to="/entity/image-data" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/image-data/${imageDataEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ imageData }: IRootState) => ({
  imageDataEntity: imageData.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageDataDetail);

import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { openFile, byteSize, Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './image-data.reducer';
import { IImageData } from 'app/shared/model/image-data.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IImageDataProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class ImageData extends React.Component<IImageDataProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { imageDataList, match } = this.props;
    return (
      <div>
        <h2 id="image-data-heading">
          <Translate contentKey="learnerappApp.imageData.home.title">Image Data</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp;
            <Translate contentKey="learnerappApp.imageData.home.createLabel">Create new Image Data</Translate>
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.imageData.frontImage">Front Image</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.imageData.backImage">Back Image</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {imageDataList.map((imageData, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${imageData.id}`} color="link" size="sm">
                      {imageData.id}
                    </Button>
                  </td>
                  <td>
                    {imageData.frontImage ? (
                      <div>
                        <a onClick={openFile(imageData.frontImageContentType, imageData.frontImage)}>
                          <img
                            src={`data:${imageData.frontImageContentType};base64,${imageData.frontImage}`}
                            style={{ maxHeight: '30px' }}
                          />
                          &nbsp;
                        </a>
                        <span>
                          {imageData.frontImageContentType}, {byteSize(imageData.frontImage)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {imageData.backImage ? (
                      <div>
                        <a onClick={openFile(imageData.backImageContentType, imageData.backImage)}>
                          <img src={`data:${imageData.backImageContentType};base64,${imageData.backImage}`} style={{ maxHeight: '30px' }} />
                          &nbsp;
                        </a>
                        <span>
                          {imageData.backImageContentType}, {byteSize(imageData.backImage)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${imageData.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${imageData.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${imageData.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ imageData }: IRootState) => ({
  imageDataList: imageData.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageData);

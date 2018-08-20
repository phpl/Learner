import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './card-info.reducer';
import { ICardInfo } from 'app/shared/model/card-info.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICardInfoProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class CardInfo extends React.Component<ICardInfoProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { cardInfoList, match } = this.props;
    return (
      <div>
        <h2 id="card-info-heading">
          <Translate contentKey="learnerappApp.cardInfo.home.title">Card Infos</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp;
            <Translate contentKey="learnerappApp.cardInfo.home.createLabel">Create new Card Info</Translate>
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
                  <Translate contentKey="learnerappApp.cardInfo.repetitions">Repetitions</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.cardInfo.difficulty">Difficulty</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.cardInfo.daysBetweenReviews">Days Between Reviews</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.cardInfo.dateLastReviewed">Date Last Reviewed</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cardInfoList.map((cardInfo, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${cardInfo.id}`} color="link" size="sm">
                      {cardInfo.id}
                    </Button>
                  </td>
                  <td>{cardInfo.repetitions}</td>
                  <td>{cardInfo.difficulty}</td>
                  <td>{cardInfo.daysBetweenReviews}</td>
                  <td>
                    <TextFormat type="date" value={cardInfo.dateLastReviewed} format={APP_LOCAL_DATE_FORMAT} />
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${cardInfo.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${cardInfo.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${cardInfo.id}/delete`} color="danger" size="sm">
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

const mapStateToProps = ({ cardInfo }: IRootState) => ({
  cardInfoList: cardInfo.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardInfo);

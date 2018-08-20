import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './card.reducer';
import { ICard } from 'app/shared/model/card.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICardProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Card extends React.Component<ICardProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { cardList, match } = this.props;
    return (
      <div>
        <h2 id="card-heading">
          <Translate contentKey="learnerappApp.card.home.title">Cards</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp;
            <Translate contentKey="learnerappApp.card.home.createLabel">Create new Card</Translate>
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
                  <Translate contentKey="learnerappApp.card.textData">Text Data</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.imageData">Image Data</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.cardInfo">Card Info</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.tag">Tag</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.userExtra">User Extra</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cardList.map((card, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${card.id}`} color="link" size="sm">
                      {card.id}
                    </Button>
                  </td>
                  <td>{card.textData ? <Link to={`textData/${card.textData.id}`}>{card.textData.id}</Link> : ''}</td>
                  <td>{card.imageData ? <Link to={`imageData/${card.imageData.id}`}>{card.imageData.id}</Link> : ''}</td>
                  <td>{card.cardInfo ? <Link to={`cardInfo/${card.cardInfo.id}`}>{card.cardInfo.id}</Link> : ''}</td>
                  <td>
                    {card.tags
                      ? card.tags.map((val, j) => (
                          <span key={j}>
                            <Link to={`tag/${val.id}`}>{val.id}</Link>
                            {j === card.tags.length - 1 ? '' : ', '}
                          </span>
                        ))
                      : null}
                  </td>
                  <td>{card.userExtra ? <Link to={`userExtra/${card.userExtra.id}`}>{card.userExtra.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${card.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${card.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${card.id}/delete`} color="danger" size="sm">
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

const mapStateToProps = ({ card }: IRootState) => ({
  cardList: card.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);

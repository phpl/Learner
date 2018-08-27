import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { openFile, byteSize, Translate, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntitiesForLoggedUser } from 'app/entities/card/card.reducer';
import { ICard } from 'app/shared/model/card.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICardProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Card extends React.Component<ICardProps> {
  componentDidMount() {
    this.props.getEntitiesForLoggedUser();
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
                  <Translate contentKey="learnerappApp.card.frontText">Front Text</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.backText">Back Text</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.frontImage">Front Image</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.backImage">Back Image</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.repetitions">Repetitions</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.dateLastReviewed">Date Last Reviewed</Translate>
                </th>
                <th>
                  <Translate contentKey="learnerappApp.card.category">Category</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cardList.map((card, i) => (
                <tr key={`entity-${i}`}>
                  <td>{card.frontText}</td>
                  <td>{card.backText}</td>
                  <td>
                    {card.frontImage ? (
                      <div>
                        <a onClick={openFile(card.frontImageContentType, card.frontImage)}>
                          <img src={`data:${card.frontImageContentType};base64,${card.frontImage}`} style={{ maxHeight: '30px' }} />
                          &nbsp;
                        </a>
                        <span>
                          {card.frontImageContentType}, {byteSize(card.frontImage)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {card.backImage ? (
                      <div>
                        <a onClick={openFile(card.backImageContentType, card.backImage)}>
                          <img src={`data:${card.backImageContentType};base64,${card.backImage}`} style={{ maxHeight: '30px' }} />
                          &nbsp;
                        </a>
                        <span>
                          {card.backImageContentType}, {byteSize(card.backImage)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{card.repetitions}</td>
                  <td>
                    <TextFormat type="date" value={card.dateLastReviewed} format={APP_LOCAL_DATE_FORMAT} />
                  </td>
                  <td>{card.category ? <Link to={`category/${card.category.id}`}>{card.category.name}</Link> : ''}</td>
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
  getEntitiesForLoggedUser
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);

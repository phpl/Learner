import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './card.reducer';
import { ICard } from 'app/shared/model/card.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICardDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class CardDetail extends React.Component<ICardDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { cardEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="learnerappApp.card.detail.title">Card</Translate> [<b>{cardEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <Translate contentKey="learnerappApp.card.textData">Text Data</Translate>
            </dt>
            <dd>{cardEntity.textData ? cardEntity.textData.id : ''}</dd>
            <dt>
              <Translate contentKey="learnerappApp.card.imageData">Image Data</Translate>
            </dt>
            <dd>{cardEntity.imageData ? cardEntity.imageData.id : ''}</dd>
            <dt>
              <Translate contentKey="learnerappApp.card.cardInfo">Card Info</Translate>
            </dt>
            <dd>{cardEntity.cardInfo ? cardEntity.cardInfo.id : ''}</dd>
            <dt>
              <Translate contentKey="learnerappApp.card.tag">Tag</Translate>
            </dt>
            <dd>
              {cardEntity.tags
                ? cardEntity.tags.map((val, i) => (
                    <span key={val.id}>
                      <a>{val.id}</a>
                      {i === cardEntity.tags.length - 1 ? '' : ', '}
                    </span>
                  ))
                : null}
            </dd>
            <dt>
              <Translate contentKey="learnerappApp.card.userExtra">User Extra</Translate>
            </dt>
            <dd>{cardEntity.userExtra ? cardEntity.userExtra.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/card" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/card/${cardEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ card }: IRootState) => ({
  cardEntity: card.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetail);

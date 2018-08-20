import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './card-info.reducer';
import { ICardInfo } from 'app/shared/model/card-info.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICardInfoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class CardInfoDetail extends React.Component<ICardInfoDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { cardInfoEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="learnerappApp.cardInfo.detail.title">CardInfo</Translate> [<b>{cardInfoEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="repetitions">
                <Translate contentKey="learnerappApp.cardInfo.repetitions">Repetitions</Translate>
              </span>
            </dt>
            <dd>{cardInfoEntity.repetitions}</dd>
            <dt>
              <span id="difficulty">
                <Translate contentKey="learnerappApp.cardInfo.difficulty">Difficulty</Translate>
              </span>
            </dt>
            <dd>{cardInfoEntity.difficulty}</dd>
            <dt>
              <span id="daysBetweenReviews">
                <Translate contentKey="learnerappApp.cardInfo.daysBetweenReviews">Days Between Reviews</Translate>
              </span>
            </dt>
            <dd>{cardInfoEntity.daysBetweenReviews}</dd>
            <dt>
              <span id="dateLastReviewed">
                <Translate contentKey="learnerappApp.cardInfo.dateLastReviewed">Date Last Reviewed</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={cardInfoEntity.dateLastReviewed} type="date" format={APP_LOCAL_DATE_FORMAT} />
            </dd>
          </dl>
          <Button tag={Link} to="/entity/card-info" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/card-info/${cardInfoEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ cardInfo }: IRootState) => ({
  cardInfoEntity: cardInfo.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardInfoDetail);

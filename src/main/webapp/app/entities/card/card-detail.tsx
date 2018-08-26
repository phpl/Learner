import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
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
              <span id="frontText">
                <Translate contentKey="learnerappApp.card.frontText">Front Text</Translate>
              </span>
            </dt>
            <dd>{cardEntity.frontText}</dd>
            <dt>
              <span id="backText">
                <Translate contentKey="learnerappApp.card.backText">Back Text</Translate>
              </span>
            </dt>
            <dd>{cardEntity.backText}</dd>
            <dt>
              <span id="frontImage">
                <Translate contentKey="learnerappApp.card.frontImage">Front Image</Translate>
              </span>
            </dt>
            <dd>
              {cardEntity.frontImage ? (
                <div>
                  <a onClick={openFile(cardEntity.frontImageContentType, cardEntity.frontImage)}>
                    <img src={`data:${cardEntity.frontImageContentType};base64,${cardEntity.frontImage}`} style={{ maxHeight: '30px' }} />
                  </a>
                  <span>
                    {cardEntity.frontImageContentType}, {byteSize(cardEntity.frontImage)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <span id="backImage">
                <Translate contentKey="learnerappApp.card.backImage">Back Image</Translate>
              </span>
            </dt>
            <dd>
              {cardEntity.backImage ? (
                <div>
                  <a onClick={openFile(cardEntity.backImageContentType, cardEntity.backImage)}>
                    <img src={`data:${cardEntity.backImageContentType};base64,${cardEntity.backImage}`} style={{ maxHeight: '30px' }} />
                  </a>
                  <span>
                    {cardEntity.backImageContentType}, {byteSize(cardEntity.backImage)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <span id="repetitions">
                <Translate contentKey="learnerappApp.card.repetitions">Repetitions</Translate>
              </span>
            </dt>
            <dd>{cardEntity.repetitions}</dd>
            <dt>
              <span id="difficulty">
                <Translate contentKey="learnerappApp.card.difficulty">Difficulty</Translate>
              </span>
            </dt>
            <dd>{cardEntity.difficulty}</dd>
            <dt>
              <span id="daysBetweenReviews">
                <Translate contentKey="learnerappApp.card.daysBetweenReviews">Days Between Reviews</Translate>
              </span>
            </dt>
            <dd>{cardEntity.daysBetweenReviews}</dd>
            <dt>
              <span id="dateLastReviewed">
                <Translate contentKey="learnerappApp.card.dateLastReviewed">Date Last Reviewed</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={cardEntity.dateLastReviewed} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <Translate contentKey="learnerappApp.card.category">Category</Translate>
            </dt>
            <dd>{cardEntity.category ? cardEntity.category.name : ''}</dd>
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

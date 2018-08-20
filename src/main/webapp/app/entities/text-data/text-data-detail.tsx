import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './text-data.reducer';
import { ITextData } from 'app/shared/model/text-data.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITextDataDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class TextDataDetail extends React.Component<ITextDataDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { textDataEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="learnerappApp.textData.detail.title">TextData</Translate> [<b>{textDataEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="frontText">
                <Translate contentKey="learnerappApp.textData.frontText">Front Text</Translate>
              </span>
            </dt>
            <dd>{textDataEntity.frontText}</dd>
            <dt>
              <span id="backText">
                <Translate contentKey="learnerappApp.textData.backText">Back Text</Translate>
              </span>
            </dt>
            <dd>{textDataEntity.backText}</dd>
          </dl>
          <Button tag={Link} to="/entity/text-data" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/text-data/${textDataEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ textData }: IRootState) => ({
  textDataEntity: textData.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextDataDetail);

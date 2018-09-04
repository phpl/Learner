import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate } from 'react-jhipster';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { IRootState } from 'app/shared/reducers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export interface IStatisticsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IStatisticsState {
  categoryList: any;
}

const data = [
  { name: 'POC CATEGORY 1', pocCardCount: 3 },
  { name: 'POC CATEGORY 2', pocCardCount: 13 },
  { name: 'POC CATEGORY 3', pocCardCount: 32 },
  { name: 'POC CATEGORY 4', pocCardCount: 8 }
];

const SimpleBarChart = () => (
  <BarChart width={window.innerWidth * 0.7} height={window.innerHeight * 0.5} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend verticalAlign="top" />
    <Bar dataKey="pocCardCount" fill="#A8C686" />
  </BarChart>
);

export class Statistics extends React.Component<IStatisticsProps, IStatisticsState> {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: {}
    };
  }

  selectStatistic = () => {};

  render() {
    const overflowAutoStyle = { overflow: 'auto' };
    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="learnerappApp.preplayroom.selectLabel">
              <Translate contentKey="statistics.selectLabel">Select statistic</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            <AvForm onSubmit={this.selectStatistic}>
              <AvGroup>
                <AvInput id="statistic" type="select" className="form-control" name="select">
                  <option id="0">
                    <Translate contentKey="statistics.cardsInCategories">Categories by cards number</Translate>
                  </option>
                  <option id="1">
                    <Translate contentKey="statistics.revisedCardsInCategories">Most revised cards in categories</Translate>
                  </option>
                </AvInput>
              </AvGroup>
              <Button color="primary" id="select" type="submit" size="lg" block>
                <FontAwesomeIcon icon="hand-pointer" />&nbsp;
                <Translate contentKey="statistics.selectLabel">Select statistic</Translate>
              </Button>
            </AvForm>
          </Col>
        </Row>
        <div style={overflowAutoStyle}>
          <Row className="justify-content-center">
            <Col md="9">
              <SimpleBarChart />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({  }: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statistics);

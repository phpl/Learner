import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate } from 'react-jhipster';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { IRootState } from 'app/shared/reducers';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getEntitiesForLoggedUser } from 'app/entities/category/category.reducer';
import { getEntitiesForLoggedUser as getProgressForLoggedUser } from 'app/entities/user-progress/user-progress.reducer';
import { getStatisticEntitiesForCategory, reset } from 'app/entities/card/card.reducer';

export interface IStatisticsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IStatisticsState {
  data: any;
  dataKey: string;
  selected: boolean;
  isLineChart: boolean;
}

const SimpleBarChart = ({ data, count }) => (
  <BarChart width={window.innerWidth * 0.7} height={window.innerHeight * 0.5} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend verticalAlign="top" />
    <Bar dataKey={count.toString()} fill="#A8C686" />
  </BarChart>
);

const SimpleLineChart = ({ data, count }) => (
  <LineChart width={window.innerWidth * 0.7} height={window.innerHeight * 0.5} data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Legend verticalAlign="top" />
    <Line type="monotone" dataKey={count} stroke="#A8C686" />
  </LineChart>
);

export class Statistics extends React.Component<IStatisticsProps, IStatisticsState> {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dataKey: 'count',
      selected: false,
      isLineChart: false
    };
  }

  componentDidMount() {
    this.props.getEntitiesForLoggedUser();
    this.props.getProgressForLoggedUser();
  }

  selectStatistic = async element => {
    const id = element.target.value;
    const data = [];
    let isLineChart = false;

    if (id === '0') {
      data.push({ name: '', count: 0 });
    } else if (id === '1') {
      for (const el of this.props.categories) {
        await this.props.getEntitiesForCategory(el.id);
        data.push({ name: el.name, count: this.props.cards.length });
        this.props.reset();
      }
      isLineChart = false;
    } else if (id === '2') {
      for (const el of this.props.categories) {
        await this.props.getEntitiesForCategory(el.id);
        const count = Math.max(...this.props.cards.map(o => o.repetitions), 0);
        data.push({ name: el.name, count });
        this.props.reset();
      }
      isLineChart = false;
    } else if (id === '3') {
      for (const el of this.props.userProgresses.slice().reverse()) {
        data.push({ name: el.day, count: el.dailyRepetitions });
      }
      isLineChart = true;
    }
    this.setState({ ...this.state, data, selected: true, isLineChart });
  };

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
            <AvForm>
              <AvGroup>
                <AvInput id="statistic" type="select" className="form-control" name="select" onChange={this.selectStatistic}>
                  <option value={0}>{}</option>
                  <option value={1}>
                    <Translate contentKey="statistics.cardsInCategories">Categories by cards number</Translate>
                  </option>
                  <option value={2}>
                    <Translate contentKey="statistics.revisedCardsInCategories">Most revised cards in categories</Translate>
                  </option>
                  <option value={3}>
                    <Translate contentKey="statistics.dailyUserProgress">Daily user card count</Translate>
                  </option>
                </AvInput>
              </AvGroup>
            </AvForm>
          </Col>
        </Row>
        {this.state.selected ? (
          <div style={overflowAutoStyle}>
            <Row className="justify-content-center">
              <Col md="9">
                {this.state.isLineChart ? (
                  <SimpleLineChart data={this.state.data} count={this.state.dataKey} />
                ) : (
                  <SimpleBarChart data={this.state.data} count={this.state.dataKey} />
                )}
              </Col>
            </Row>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  categories: storeState.category.entities,
  cards: storeState.card.entities,
  userProgresses: storeState.userProgress.entities
});

const mapDispatchToProps = {
  getEntitiesForLoggedUser,
  getEntitiesForCategory: getStatisticEntitiesForCategory,
  reset,
  getProgressForLoggedUser
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statistics);

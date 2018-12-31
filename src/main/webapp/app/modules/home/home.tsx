import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    const { account } = this.props;
    return (
      <Row>
        <Col md="9">
          <h2>
            <Translate contentKey="home.title">Welcome!</Translate>
          </h2>
          <p className="lead">
            <Translate contentKey="home.subtitle">Start your learnng today</Translate>
          </p>
          {account && account.login ? (
            <div>
              <Alert color="success">
                <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                  You are logged in as user {account.login}.
                </Translate>
              </Alert>
            </div>
          ) : (
            <div>
              <Alert color="warning">
                <Translate contentKey="global.messages.info.register.noaccount">You do not have an account yet?</Translate>&nbsp;
                <Link to="/register" className="alert-link">
                  <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                </Link>
              </Alert>
            </div>
          )}
          {account && account.login ? (
            <div>
              <h4>
                <Translate contentKey="home.tutorial.about">Tutorial</Translate>
              </h4>
              <p>
                <Translate contentKey="home.tutorial.paragraph">Lorem Ipsum</Translate>
              </p>
            </div>
          ) : (
            ''
          )}
          <h4>
            <Translate contentKey="home.application.about">About application</Translate>
          </h4>
          <p>
            <Translate contentKey="home.application.paragraph">Lorem Ipsum</Translate>
          </p>
          <h4>
            <Translate contentKey="home.flashcards.about">About flashcards</Translate>
          </h4>
          <p>
            <Translate contentKey="home.flashcards.paragraph">Lorem Ipsum</Translate>
          </p>
        </Col>
        <Col md="3" className="pad">
          <span className="logo rounded" />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

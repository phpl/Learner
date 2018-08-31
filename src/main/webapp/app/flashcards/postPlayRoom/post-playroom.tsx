import './post-playroom.scss';

import React, { Component } from 'react';
import { Translate } from 'react-jhipster';
import { Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class PostPlayroom extends Component {
  render() {
    return (
      <div>
        <Row className="justify-content-center">
          <div className="col-md-4 col-md-offset-4 text-center">
            <span className="brain rounded" />
          </div>
        </Row>
        <Row className="justify-content-center">
          <div className="col-md-4 col-md-offset-4 text-center">
            <h2 id="learnerappApp.preplayroom.postMessage">
              <Translate contentKey="postplayroom.postMessage">You did great!</Translate>
            </h2>
          </div>
        </Row>
        <Row className="justify-content-center">
          <div className="col-md-4 col-md-offset-4 text-center">
            <h4 id="learnerappApp.preplayroom.postMessage">
              <Translate contentKey="postplayroom.restartMessage">Want to play one more time?</Translate>
            </h4>
          </div>
        </Row>
        <Row className="justify-content-center">
          <div className="col-md-4 col-md-offset-4 text-center">
            <Button tag={Link} id="restart-playroom" to="/flashcards/preplayroom" replace color="info" size="lg" block>
              <FontAwesomeIcon icon="smile-beam" />&nbsp;
              <span className="d-none d-md-inline">
                <Translate contentKey="postplayroom.agreeMessage">Yes</Translate>
              </span>
            </Button>
            <Button tag={Link} id="restart-playroom" to="/" replace color="danger" size="lg" block>
              <FontAwesomeIcon icon="frown" />&nbsp;
              <span className="d-none d-md-inline">
                <Translate contentKey="postplayroom.disagreeMessage">No</Translate>
              </span>
            </Button>
          </div>
        </Row>
      </div>
    );
  }
}

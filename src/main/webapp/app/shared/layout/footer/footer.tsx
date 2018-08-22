import './footer.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { Col, Row } from 'reactstrap';

const Footer = props => (
  <div className="footer page-content">
    <Row>
      <Col md="12">
        <p>
          <Translate contentKey="footer">BSc Thesis, Paweł Hadam, 2018</Translate>
        </p>
      </Col>
    </Row>
  </div>
);

export default Footer;

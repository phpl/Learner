import React from 'react';
import { connect } from 'react-redux';
import { Flipper, Front, Back } from 'react-flipper';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from 'app/entities/category/category.reducer';
import { Col, Row, ButtonGroup, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import AnimatedRater from 'app/flashcards/playroom/animatedRater/animated-rater';

export interface IPlayroomProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IPlayroomState {
  isFlipped: boolean;
  starsVisibility: boolean;
  isNext: boolean;
  id: number;
}

export class Playroom extends React.Component<IPlayroomProps, IPlayroomState> {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false,
      starsVisibility: false,
      isNext: false,
      id: this.props.categoryEntity.id
    };
  }

  flip = () => {
    this.setState({ ...this.state, starsVisibility: true, isFlipped: !this.state.isFlipped });
  };

  handleNext = () => {
    this.setState({ ...this.state, starsVisibility: false, isNext: true, isFlipped: false });
  };

  render() {
    return (
      <div>
        <Row className="justify-content-center">
          <div className="col-md-4 col-md-offset-4 text-center">
            <Flipper isFlipped={this.state.isFlipped} orientation="horizontal">
              <Front
                style={{
                  background: '#A8C686',
                  minWidth: 400,
                  minHeight: 400
                }}
              >
                POC Question
              </Front>
              <Back
                style={{
                  background: '#9D9C62',
                  minWidth: 400,
                  minHeight: 400
                }}
              >
                POC Answer
              </Back>
            </Flipper>
          </div>
        </Row>
        <Row className="justify-content-center">
          <div className="col-md-4 col-md-offset-4 text-center">
            <AnimatedRater shouldStart={this.state.starsVisibility} defaultStyles={null} rating={null} />
            <ButtonGroup>
              <Button onClick={this.flip} color="info" size="lg">
                <FontAwesomeIcon icon="eye" />{' '}
                <span className="d-none d-md-inline">
                  <Translate contentKey="playroom.reveal">Reveal</Translate>
                </span>
              </Button>
              <Button onClick={this.handleNext} color="danger" size="lg">
                <FontAwesomeIcon icon="arrow-right" />{' '}
                <span className="d-none d-md-inline">
                  <Translate contentKey="playroom.next">Next</Translate>
                </span>
              </Button>
            </ButtonGroup>
          </div>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ category }: IRootState) => ({
  categoryEntity: category.entity
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playroom);

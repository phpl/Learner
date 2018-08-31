import React from 'react';
import { connect } from 'react-redux';
import { Flipper, Front, Back } from 'react-flipper';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { Row, ButtonGroup, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { openFile, Translate } from 'react-jhipster';
import AnimatedRater from 'app/flashcards/playroom/animatedRater/animated-rater';
import { getEntitiesForCategory } from 'app/entities/card/card.reducer';
import { toast } from 'react-toastify';

export interface IPlayroomProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IPlayroomState {
  isFlipped: boolean;
  starsVisibility: boolean;
  isNext: boolean;
  id: number;
  cardsIndex: number;
  rating: number;
}

export class Playroom extends React.Component<IPlayroomProps, IPlayroomState> {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false,
      starsVisibility: false,
      isNext: false,
      id: this.props.categoryEntity.id,
      cardsIndex: 0,
      rating: 0
    };
  }

  componentDidMount() {
    this.props.getEntitiesForCategory(this.state.id);
  }

  flip = () => {
    this.setState({ ...this.state, starsVisibility: true, isFlipped: !this.state.isFlipped });
  };

  handleNext = () => {
    const cardListSize = this.props.cardList.length - 1;
    if (this.state.rating > 0) {
      if (this.state.cardsIndex < cardListSize) {
        this.setState({
          ...this.state,
          starsVisibility: false,
          isNext: true,
          isFlipped: false,
          cardsIndex: this.state.cardsIndex + 1
        });
      } else {
        this.props.history.push('/flashcards/postplayroom');
      }
    } else {
      if (this.props.currentLocale === 'en') {
        toast.error('No stars selected!');
      } else if (this.props.currentLocale === 'pl') {
        toast.error('Nie zaznaczono gwiazdek!');
      }
    }
  };

  handleRate = rating => {
    this.setState({ ...this.state, rating });
  };

  render() {
    const { cardList } = this.props;
    const currentCard = cardList[this.state.cardsIndex];
    return (
      <div>
        {cardList.length > 0 ? (
          <React.Fragment>
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
                    {currentCard.frontText ? <h3>{currentCard.frontText}</h3> : null}
                    {currentCard.frontImage ? (
                      <a onClick={openFile(currentCard.frontImageContentType, currentCard.frontImage)}>
                        <img
                          src={`data:${currentCard.frontImageContentType};base64,${currentCard.frontImage}`}
                          style={{ maxHeight: '350px' }}
                        />
                        &nbsp;
                      </a>
                    ) : null}
                  </Front>
                  <Back
                    style={{
                      background: '#9D9C62',
                      minWidth: 400,
                      minHeight: 400
                    }}
                  >
                    {currentCard.backText ? <h3>{currentCard.backText}</h3> : null}
                    {currentCard.backImage ? (
                      <a onClick={openFile(currentCard.backImageContentType, currentCard.backImage)}>
                        <img
                          src={`data:${currentCard.backImageContentType};base64,${currentCard.backImage}`}
                          style={{ maxHeight: '350px' }}
                        />
                        &nbsp;
                      </a>
                    ) : null}
                  </Back>
                </Flipper>
              </div>
            </Row>
            <Row className="justify-content-center">
              <div className="col-md-4 col-md-offset-4 text-center">
                <AnimatedRater handleRate={this.handleRate} shouldStart={this.state.starsVisibility} defaultStyles={null} rating={null} />
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
          </React.Fragment>
        ) : (
          <h1>
            <Translate contentKey="playroom.nocards">No cards in this category</Translate>
          </h1>
        )}
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  categoryEntity: storeState.category.entity,
  cardList: storeState.card.entities,
  currentLocale: storeState.locale.currentLocale
});

const mapDispatchToProps = {
  getEntitiesForCategory
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playroom);

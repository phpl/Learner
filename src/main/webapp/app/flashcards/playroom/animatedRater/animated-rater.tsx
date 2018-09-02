import React from 'react';
import Rater from 'react-rater';
import { Motion, StaggeredMotion, spring, presets } from 'react-motion';
import './animated-rater.scss';
import { Translate } from 'react-jhipster';
import Star from 'app/flashcards/playroom/animatedRater/star';

// https://github.com/NdYAG/react-rater/blob/master/example
// Author in git above this line.
// BSD licenced
// Changed for my usage

export interface IAnimatedRaterProps {
  handleRate;
  shouldStart: boolean;
}

export interface IAnimatedRaterState {
  shouldStart: boolean;
  rating: number;
  defaultStyles: any;
}

export default class AnimatedRater extends React.Component<IAnimatedRaterProps, IAnimatedRaterState> {
  constructor(props) {
    super(props);
    this.state = {
      shouldStart: false,
      rating: 0,
      defaultStyles: [{ x: 0 }, { x: 0 }, { x: 0 }, { x: 0 }, { x: 0 }]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldStart) {
      setTimeout(() => {
        this.setState({ ...this.state, shouldStart: true });
      }, 1000);
    } else {
      setTimeout(() => {
        this.setState({
          ...this.state,
          shouldStart: false,
          rating: 0,
          defaultStyles: [{ x: 0 }, { x: 0 }, { x: 0 }, { x: 0 }, { x: 0 }]
        });
      }, 1000);
    }
  }

  handleRate = ({ rating }) => {
    const defaultStyles = [{ x: 0 }, { x: 0 }, { x: 0 }, { x: 0 }, { x: 0 }].map((style, i) => {
      if (rating < i + 1) {
        return { x: 1 };
      }
      return style;
    });
    this.setState({
      ...this.state,
      rating,
      defaultStyles
    });
    this.props.handleRate(rating);
  };

  getStyle = prevInterpolatedStyles => {
    const { shouldStart, rating }: Readonly<any> = this.state;

    if (!shouldStart) {
      return prevInterpolatedStyles.map((_, i) => {
        return i === 0 ? { x: spring(0, presets.stiff) } : { x: spring(prevInterpolatedStyles[i - 1].x, presets.stiff) };
      });
    } else {
      if (rating) {
        return prevInterpolatedStyles.map((_, i) => {
          if (i + 1 > rating) {
            return { x: 1 };
          }
          return i === 0 ? { x: spring(1, presets.gentle) } : { x: spring(prevInterpolatedStyles[i - 1].x, presets.gentle) };
        });
      } else {
        return prevInterpolatedStyles.map((_, i) => {
          return i === 0 ? { x: spring(1, presets.wobbly) } : { x: spring(prevInterpolatedStyles[i - 1].x, presets.wobbly) };
        });
      }
    }
  };

  render() {
    return (
      <div className="animated-rater">
        {this.state.shouldStart ? (
          <h5>
            <span className="d-none d-md-inline">
              <Translate contentKey="playroom.performance">Performance</Translate>
            </span>
          </h5>
        ) : (
          <h5 className="invisible">
            <span className="d-none d-md-inline">
              <Translate contentKey="playroom.performance">Performance</Translate>
            </span>
          </h5>
        )}
        <StaggeredMotion
          defaultStyles={this.state.defaultStyles}
          styles={this.getStyle}
          key={this.state.defaultStyles.filter(style => style.x === 1).length}
        >
          {interpolatingStyles => (
            <Rater total={5} rating={this.state.rating} onRate={this.handleRate}>
              {interpolatingStyles.map((style, i) => <Star style={{ transform: `scale(${style.x})` }} key={i} isActive willBeActive />)}
            </Rater>
          )}
        </StaggeredMotion>
      </div>
    );
  }
}

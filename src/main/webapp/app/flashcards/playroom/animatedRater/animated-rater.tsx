import React from 'react';
import PropTypes from 'prop-types';
import Rater from 'react-rater';
import { Motion, StaggeredMotion, spring, presets } from 'react-motion';
import './animated-rater.scss';
import Translate from 'react-jhipster/lib/src/language/translate';

// https://github.com/NdYAG/react-rater/blob/master/example
// Author in git above this line.
// BSD licenced
// Changed for my usage

const Star = ({ willBeActive, isActive, style }) => {
  const fill = isActive ? '#fc6' : willBeActive ? '#ffdd99' : '#e3e3e3';

  return (
    <svg viewBox="0 0 19.481 19.481" width="36" height="36" style={style}>
      <path
        fill={fill}
        d={
          'm10.201,.758l2.478,5.865 6.344,.545c0.44,0.038 0.619,0.587 ' +
          '0.285,0.876l-4.812,4.169 1.442,6.202c0.1,0.431-0.367,0.77-0' +
          '.745,0.541l-5.452-3.288-5.452,3.288c-0.379,0.228-0.845-0.11' +
          '1-0.745-0.541l1.442-6.202-4.813-4.17c-0.334-0.289-0.156-0.8' +
          '38 0.285-0.876l6.344-.545 2.478-5.864c0.172-0.408 0.749-0.408 0.921,0z'
        }
      />
    </svg>
  );
};

// @ts-ignore
Star.propTypes = {
  isActive: PropTypes.bool,
  willBeActive: PropTypes.bool,
  style: PropTypes.any
};

export interface IAnimatedRaterProps {
  handleRate;
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
              {interpolatingStyles.map((style, i) => <Star style={{ transform: `scale(${style.x})` }} key={i} />)}
            </Rater>
          )}
        </StaggeredMotion>
      </div>
    );
  }
}

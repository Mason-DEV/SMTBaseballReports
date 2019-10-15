//Layout for the OPS
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class CardsOP extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <div> OP Cards</div>
      </React.Fragment>
    );
  }
}

CardsOP.propTypes = propTypes;
CardsOP.defaultProps = defaultProps;

export default CardsOP;

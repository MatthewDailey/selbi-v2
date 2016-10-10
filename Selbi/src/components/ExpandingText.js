import React, { Component } from 'react';
import { TouchableHighlight, Text } from 'react-native';

import colors from '../../colors';

export default class ExpandingText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: this.props.initialIsOpen,
    };

    this.toggleExpansion = this.toggleExpansion.bind(this);
  }

  getText() {
    if (this.state.isOpen) {
      return (
        <Text style={this.props.style}>
          {this.props.children}
        </Text>
      );
    }
    return (
      <Text ellipsizeMode="tail" numberOfLines={1} style={this.props.style}>
        {this.props.children}
      </Text>
    );
  }

  toggleExpansion() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <TouchableHighlight underlayColor={colors.transparent} onPress={this.toggleExpansion}>
        {this.getText()}
      </TouchableHighlight>
    );
  }
}

ExpandingText.propTypes = {
  style: React.PropTypes.any,
  children: React.PropTypes.node,
  initialIsOpen: React.PropTypes.bool,
};

ExpandingText.defaultProps = {
  initialIsOpen: false,
};

import React from 'react';
import { Linking, View } from 'react-native';

export default class DeepLinkListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpenURL = this.handleOpenURL.bind(this);
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL(event) {
    console.log('Opened url: ', event.url);
  }

  render() {
    return <View />;
  }
}

DeepLinkListener.propTypes = {
  navigator: React.PropTypes.object.isRequired,
};

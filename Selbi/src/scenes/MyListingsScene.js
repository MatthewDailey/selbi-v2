import React from 'react';
import { connect } from 'react-redux';
import { InteractionManager, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import RoutableScene from '../nav/RoutableScene';
import ListingsComponent from '../components/ListingsListComponent';

import styles from '../../styles';
import colors from '../../colors';

class MyListingsScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.state = { renderPlaceholderOnly: true };
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        renderPlaceholderOnly: false,
      });
    });
  }

  renderWithNavBar() {
    if (this.state.renderPlaceholderOnly) {
      return (
        <View style={styles.container} />
      );
    }

    return (
      <ScrollableTabView
        tabBarBackgroundColor={colors.primary}
        tabBarUnderlineColor={colors.secondary}
        tabBarActiveTextColor={colors.secondary}
        style={styles.fullScreenContainer}
      >
        <View tabLabel="Inactive" style={styles.fullScreenContainer}>
          <ListingsComponent
            listings={this.props.inactive}
            openSimpleScene={this.openSimpleScene}
          />
        </View>
        <View tabLabel="Public" style={styles.fullScreenContainer}>
          <ListingsComponent
            listings={this.props.public}
            openSimpleScene={this.openSimpleScene}
          />
        </View>
        <View tabLabel="Private" style={styles.fullScreenContainer}>
          <ListingsComponent
            listings={this.props.private}
            openSimpleScene={this.openSimpleScene}
          />
        </View>
        <View tabLabel="Sold" style={styles.fullScreenContainer}>
          <ListingsComponent
            listings={this.props.sold}
            openSimpleScene={this.openSimpleScene}
          />
        </View>
      </ScrollableTabView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    inactive: state.myListings.inactive,
    public: state.myListings.public,
    private: state.myListings.private,
    sold: state.myListings.sold,
  };
};

export default connect(
  mapStateToProps,
  undefined
)(MyListingsScene);

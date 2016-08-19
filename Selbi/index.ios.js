import React, { Component } from 'react';
import { AppRegistry, View, ScrollView, ListView, Navigator, Text, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import NavigationBar from 'react-native-navbar';

import styles from './styles.js';

import StatusBar from './components/StatusBar';
import ItemView from './components/ItemView';
import Camera from './components/Camera';

const config = {
  apiKey: 'AIzaSyDRHkRtloZVfu-2CXADbyJ_QG3ECRtZacY',
  authDomain: 'selbi-react-prototype.firebaseapp.com',
  databaseURL: 'https://selbi-react-prototype.firebaseio.com',
  storageBucket: 'selbi-react-prototype.appspot.com',
};
firebase.initializeApp(config);

class ListingsView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds,
    };

    const updateListingsView = (listings) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(listings),
      });
    };

    firebase
      .auth()
      .signInAnonymously()
      .then(() => firebase
        .database()
        .ref('listings')
        .once('value'))
      .then((snapshot) => {
        updateListingsView(snapshot.val())
        console.log(snapshot.val());
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return <ListView
      contentContainerStyle={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
      dataSource={this.state.dataSource}
      renderRow={(data) => <ItemView {...data} />}
    />
  }
}

class ListMobile extends Component {
  render() {
    const menuButtonConfig = () => { return {
      title: 'Menu',
      handler: this.props.openDrawer,
    }};

    const backButtonConfig = (navigator) => { return {
      title: '< Back',
      handler: () => navigator.pop()
    }};

    const routes = [
      { title: 'Listings Near You',
        left: menuButtonConfig,
        right:  {
          label: 'Sell',
          getHandler: (navigator) => () => navigator.push(routes[1]),
        },
        renderContent: () => <ListingsView />,
        index: 0 },
      { title: 'Create Listing',
        left: backButtonConfig,
        right:  {
          label: 'Done',
          getHandler: (navigator) => () => navigator.popToTop()
        },
        renderContent: () => <Camera/>,
        showSimple: true,
        index: 1 }
    ];

    return (
      <Navigator
        initialRoute={routes[0]}
        renderScene={(route, navigator) => {
          return (
            // Note this flex:1 style. Super fucking important to make sure listview can scroll.
            // Without it, the view will just bounce back. Who the fuck knows why.
            <View style={{flex: 1}}>
              <NavigationBar
                title={{title: route.title}}
                leftButton={route.left(navigator)}
                rightButton={{
                  title: route.right.label,
                  handler: route.right.getHandler(navigator),
                }}
              />
              {route.renderContent(navigator)}
            </View>
          );
        }}
      />
    );
  }
}

import Drawer from 'react-native-drawer';

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 0},
  main: {paddingLeft: 0},
}

function ControlPanel() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text>Menu</Text>
    </View>
  );
}

class Application extends React.Component {
  // noinspection Eslint - This syntax is necessary to properly bind the method.
  openControlPanel = () => {
    this.drawer.open()
  };

  render() {
    return (
      <Drawer
        ref={(c) => {
          this.drawer = c;
        }}
        content={<ControlPanel />}
        tapToClose
        styles={drawerStyles}
        openDrawerOffset={0.2}
        panOpenMask={0.1}
      >
        <ListMobile openDrawer={this.openControlPanel} />
      </Drawer>
    );
  }
}


AppRegistry.registerComponent('Selbi', () => Application);

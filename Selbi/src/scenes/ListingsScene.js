import React from 'react';

import { loadListingByLocation } from '../firebase/FirebaseConnector';
import RoutableScene from '../nav/RoutableScene';
import ListingsComponent from '../components/ListingsListComponent';


export default class ListingsScene extends RoutableScene {
  constructor(props) {
    super(props);

    this.getGeolocation = this.getGeolocation.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  getGeolocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          // Code: 1 = permission denied, 2 = unavailable, 3 = timeout.
          reject(error.message);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    });
  }

  fetchData() {
    return this.getGeolocation().then((latlon) => loadListingByLocation(latlon, 20));
  }

  renderWithNavBar() {
    return (
      <ListingsComponent
        fetchData={this.fetchData}
        openSimpleScene={this.openSimpleScene}
      />
    );
  }
}

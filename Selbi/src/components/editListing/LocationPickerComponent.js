import React from 'react';
import { View, Text, MapView } from 'react-native';


class DraggableAnnotationExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirstLoad: true,
      annotations: [],
    };
  }

  createAnnotation(longitude, latitude) {
    return {
      longitude,
      latitude,
      draggable: true,
      onDragStateChange: (event) => {
        if (event.state === 'idle') {
          this.setState({
            annotations: [this.createAnnotation(event.longitude, event.latitude)],
          });
          this.props.setLocation({
            lat: event.latitude,
            lon: event.longitude,
          });
        }
      },
    };
  }

  render() {
    const onRegionChangeComplete = (region) => {
      // When the MapView loads for the first time, we can create the annotation at the
      // region that was loaded.
      if (this.state.isFirstLoad) {
        this.setState({
          isFirstLoad: false,
          annotations: [this.createAnnotation(region.longitude, region.latitude)],
        });
      }
    };

    return (
      <MapView
        style={{ height: 160 }}
        onRegionChangeComplete={onRegionChangeComplete}
        region={this.props.region}
        annotations={this.state.annotations}
      />
    );
  }
}
DraggableAnnotationExample.propTypes = {
  setLocation: React.PropTypes.func.isRequired,
  region: React.PropTypes.shape({
    latitude: React.PropTypes.number.isRequired,
    longitude: React.PropTypes.number.isRequired,
    latitudeDelta: React.PropTypes.number.isRequired,
    longitudeDelta: React.PropTypes.number.isRequired,
  }),
};

/*
 * This component includes a map with a marker that users can use to update their listings location.
 *
 * The map will only be visible if when the listing status requires location.
 */
export default function LocationPickerComponent({ lat, lon, listingStatus, setLocation }) {
  if (lat && lon && listingStatus === 'public') {
    return (
      <View>
        <Text style={{ fontWeight: 'bold' }}>Location</Text>
        <Text>
          Don't worry about making this precise. Your exact location is never shared with other
          users. It is only used for proximity.
        </Text>
        <DraggableAnnotationExample
          region={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          setLocation={setLocation}
        />
      </View>
    );
  }
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>Location</Text>
      <Text>No location for this listing. Only public listings have an associated location.</Text>
    </View>
  );
}
LocationPickerComponent.propTypes = {
  lat: React.PropTypes.number,
  lon: React.PropTypes.number,
  listingStatus: React.PropTypes.string,
  setLocation: React.PropTypes.func.isRequired,
};

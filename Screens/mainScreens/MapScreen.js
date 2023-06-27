import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';

export default function MapScreen({ route }) {
  // const { name, latitude, longitude } = route.params;
  const [location, setLocation] = useState({});
  // set location
  useEffect(() => {
    if (route.params) {
      setLocation({
        latitude: route.params.location.latitude,
        longitude: route.params.location.longitude,
      });
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <MapView
        style={{
          flex: 1,
        }}
        region={{
          ...location,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
        mapType="standard"
      >
        <Marker title="You are here" coordinate={location} description="Photo was taken here" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

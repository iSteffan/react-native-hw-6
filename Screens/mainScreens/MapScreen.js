import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ route }) {
  const { name, latitude, longitude } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={{
          flex: 1,
        }}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
      >
        <Marker title={name} coordinate={{ latitude: latitude, longitude: longitude }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Search as SearchIcon } from 'lucide-react-native';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState<Region | null>(null);

  // Get initial location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  // When user submits a location in search bar
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        Alert.alert('Not Found', 'Could not find that location.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while searching.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch} // 🔍 Trigger on enter/search
          returnKeyType="search"
        />
      </View>

      <View style={styles.mapContainer}>
        {region && (
          <MapView
          style={styles.map}
          region={region}
          mapType="satellite" // 👈 This line enables satellite view
          showsUserLocation={true}
          showsMyLocationButton={true}
        />
        )}
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Risk Assessment</Text>
        <View style={styles.riskCard}>
          <Text style={styles.riskLevel}>Low Risk</Text>
          <Text style={styles.riskDescription}>
            No immediate threats detected in this area. Monitor local weather updates.
          </Text>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  searchContainer: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  resultsContainer: {
    margin: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  riskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  riskLevel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  riskDescription: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
});
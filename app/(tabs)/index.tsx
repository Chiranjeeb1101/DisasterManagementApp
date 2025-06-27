import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Cloud, Sun, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { getWeatherByCoords } from '../../weatherservice'; // Import the weather service
import { useTheme } from '../theme-context';
import { lightTheme, darkTheme } from '../theme';

type WeatherStatus = {
  temperature: number;
  humidity: number;
  condition: string; // Changed to string to handle dynamic conditions
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [weather, setWeather] = useState<WeatherStatus | null>(null); // Allow null for initial state
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
      }

      let location = await Location.getLastKnownPositionAsync({});
        if (!location) {
          location = await Location.getCurrentPositionAsync({});
        }
      setLocation(location);

      // Fetch weather data
      if (location) {
        const weatherData = await getWeatherByCoords(
          location.coords.latitude,
          location.coords.longitude
        );

        if (weatherData) {
          setWeather({
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            condition: weatherData.weather[0].main.toLowerCase(), // e.g., 'cloudy', 'sunny'
          });
        }
      }
    })();
  }, []);

  const WeatherIcon = weather?.condition === 'sunny' ? Sun : Cloud;

  const weatherAlerts: Record<string, { alert: string; tips: string[] }> = {
  rain: {
    alert: "Heavy Rain Warning in your area",
    tips: [
      "Carry an umbrella or raincoat",
      "Avoid waterlogged areas",
      "Drive slowly and carefully",
      "Stay updated with weather reports",
    ],
  },
  thunderstorm: {
    alert: "Thunderstorm Alert! Stay indoors",
    tips: [
      "Avoid using electrical appliances",
      "Do not take shelter under trees",
      "Stay away from windows",
      "Keep emergency lights handy",
    ],
  },
  flood: {
    alert: "Flash Flood Warning in your area",
    tips: [
      "Move to higher ground immediately",
      "Avoid walking through moving water",
      "Stay away from power lines",
      "Keep emergency contacts handy",
    ],
  },
  clear: {
    alert: "Weather is clear. Stay safe!",
    tips: [
      "Stay hydrated",
      "Wear sunscreen when outdoors",
      "Enjoy your day responsibly",
      "Check forecasts for upcoming changes",
    ],
  },
};

const alertInfo = weather?.condition ? weatherAlerts[weather.condition] : undefined;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top, backgroundColor: currentTheme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.text }]}>Disaster Alert</Text>
      </View>

      <View style={styles.weatherCard}>
        {weather ? (
          <>
            <WeatherIcon size={48} color="#dc2626" />
            <View style={styles.weatherInfo}>
              <Text style={[styles.temperature, { color: currentTheme.text }]}>{weather.temperature}°C</Text>
              <Text style={[styles.humidity, { color: currentTheme.text }]}>Humidity: {weather.humidity}%</Text>
            </View>
          </>
        ) : (
          <Text style={[{ color: currentTheme.text }]}>Loading weather data...</Text>
        )}
      </View>

      {location && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        </View>
      )}
<View style={styles.alertsSection}>
  <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Active Alert</Text>
  <View style={styles.alertCard}>
    <AlertTriangle size={24} color="#dc2626" />
    <Text style={styles.alertText}>
      {alertInfo ? alertInfo.alert : 'No active alerts'}
    </Text>
  </View>
</View>

<View style={styles.tipsSection}>
  <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Safety Tips</Text>
  <View style={styles.tipCard}>
    <Text style={[styles.tipTitle, { color: currentTheme.text }]}>
      {weather?.condition ? `During ${weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}` : 'General Tips'}
    </Text>
    <Text style={[styles.tipText, { color: currentTheme.text }]}>
      {alertInfo && typeof alertInfo !== 'string'
        ? alertInfo.tips.map(tip => `• ${tip}\n`).join('')
        : 'Stay prepared and stay safe!'}
    </Text>
  </View>
</View>


     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  weatherInfo: {
    marginLeft: 16,
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  humidity: {
    fontSize: 16,
    color: '#6b7280',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  alertsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  alertCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#dc2626',
    flex: 1,
  },
  tipsSection: {
    marginBottom: 16,
  },
  tipCard: {
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
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  themeToggle: {
    marginTop: 16,
    alignItems: 'center',
  },
});
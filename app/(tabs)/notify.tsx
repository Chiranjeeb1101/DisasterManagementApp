import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  PermissionsAndroid,
  Clipboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircleAlert as AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

const NotifyScreen = () => {
  const insets = useSafeAreaInsets();
  const [sending, setSending] = useState(false);
  const EMERGENCY_NUMBER = '+919693437679';

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestSMSPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            title: 'SMS Permission',
            message: 'This app needs permission to send SMS as a fallback.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const sendViaSMS = async (message: string) => {
    try {
      const hasPermission = await requestSMSPermission();
      if (!hasPermission) return false;

      const url = `sms:${EMERGENCY_NUMBER}?body=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return true;
      }
      return false;
    } catch (error) {
      console.error('SMS Error:', error);
      return false;
    }
  };

  const sendViaWhatsApp = async (message: string) => {
    try {
      const url = `https://wa.me/${EMERGENCY_NUMBER}?text=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return true;
      }
      return false;
    } catch (error) {
      console.error('WhatsApp Error:', error);
      return false;
    }
  };

  const copyToClipboard = (message: string) => {
    Clipboard.setString(message);
    Alert.alert('Copied', 'Emergency message copied to clipboard');
  };

  const handleSendSOS = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    setSending(true);

    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to send an SOS alert.');
      setSending(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const message = `🚨 SOS EMERGENCY! I need immediate help!\n\n📍 My current location: https://maps.google.com/?q=${latitude},${longitude}\n\nSent via SafetyApp`;

      const whatsappSuccess = await sendViaWhatsApp(message);
      if (!whatsappSuccess) {
        const smsSuccess = await sendViaSMS(message);
        if (!smsSuccess) {
          Alert.alert('Error', 'Could not send via WhatsApp or SMS', [
            {
              text: 'Copy Message',
              onPress: () => copyToClipboard(message),
            },
            { text: 'OK' },
          ]);
        } else {
          Alert.alert('Success', 'Emergency message sent via SMS');
        }
      } else {
        Alert.alert('Success', 'Emergency message sent via WhatsApp');
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'Could not get your location. Send without location?',
        [
          {
            text: 'Send Anyway',
            onPress: async () => {
              const message = '🚨 SOS EMERGENCY! I need immediate help!\n\n(Sent via SafetyApp)';
              await sendViaWhatsApp(message) || await sendViaSMS(message);
              setSending(false);
            },
          },
          {
            text: 'Cancel',
            onPress: () => setSending(false),
            style: 'cancel',
          },
        ]
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Alert</Text>
      </View>

      <View style={styles.sosContainer}>
        <TouchableOpacity
          style={[styles.sosButton, sending && styles.sosButtonActive]}
          onPress={handleSendSOS}
          disabled={sending}
          activeOpacity={0.8}
        >
          <AlertCircle size={48} color="#fff" />
          <Text style={styles.sosText}>
            {sending ? 'SENDING SOS...' : 'SEND SOS ALERT'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>What happens when you send SOS?</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            • Your emergency contacts will be notified immediately{'\n'}
            • Your current location will be shared automatically{'\n'}
            • Message will be sent via WhatsApp (with SMS fallback){'\n'}
            • You'll receive confirmation when sent successfully
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  sosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sosButton: {
    backgroundColor: '#dc2626',
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#dc2626',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  sosButtonActive: {
    backgroundColor: '#991b1b',
  },
  sosText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    letterSpacing: 1,
  },
  infoContainer: {
    padding: 20,
    paddingTop: 0,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f3f4f6',
      },
    }),
  },
  infoText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
});

export default NotifyScreen;

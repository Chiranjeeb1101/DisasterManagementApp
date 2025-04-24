import { Tabs } from 'expo-router';
import { Home, Search, Bell, User } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { ThemeContext } from '../theme-context';

export const getThemeColors = (theme: 'light' | 'dark') => ({
  background: theme === 'light' ? '#ffffff' : '#000000',
  text: theme === 'light' ? '#000000' : '#ffffff',
  subtext: theme === 'light' ? '#666666' : '#aaaaaa',
  cardBackground: theme === 'light' ? '#f8f8f8' : '#1c1c1c',
  icon: theme === 'light' ? '#000000' : '#ffffff',
  divider: theme === 'light' ? '#e0e0e0' : '#333333',
  primary: theme === 'light' ? '#007bff' : '#1e90ff', // Added primary color
  switch: {
    trackInactive: theme === 'light' ? '#e0e0e0' : '#333333',
    trackActive: theme === 'light' ? '#4caf50' : '#81c784',
    thumbInactive: theme === 'light' ? '#ffffff' : '#000000',
    thumbActive: theme === 'light' ? '#ffffff' : '#000000',
  },
  error: theme === 'light' ? '#f44336' : '#e57373',
});

export const useTheme = () => {
  const { theme } = useContext(ThemeContext) as { theme: 'light' | 'dark' };
  return { theme };
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)', // Replace with a default shadow color
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1, // Replace with a default shadow opacity
          shadowRadius: 2,
          elevation: 2,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -2,
        },
        tabBarItemStyle: {
          padding: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<'index' | 'search' | 'notify' | 'profile', JSX.Element> = {
            index: <Home size={size-2} color={color} strokeWidth={focused ? 2.5 : 1.5} />,
            search: <Search size={size-2} color={color} strokeWidth={focused ? 2.5 : 1.5} />,
            notify: <Bell size={size-2} color={color} strokeWidth={focused ? 2.5 : 1.5} />,
            profile: <User size={size-2} color={color} strokeWidth={focused ? 2.5 : 1.5} />,
          };
          
          return (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 46,
              height: 26,
              borderBottomWidth: focused ? 2 : 0,
              borderBottomColor: colors.primary,
              marginBottom: focused ? 0 : 2,
            }}>
              {icons[route.name as 'index' | 'search' | 'notify' | 'profile']}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />
      <Tabs.Screen
        name="notify"
        options={{
          title: 'Notifications',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
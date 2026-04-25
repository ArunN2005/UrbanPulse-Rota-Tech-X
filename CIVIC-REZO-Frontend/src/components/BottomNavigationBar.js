import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  Animated
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const BottomNavigationBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  // Animations
  const tabPositions = React.useRef(
    state.routes.map((_, i) => new Animated.Value(i === state.index ? 1 : 0))
  ).current;

  useEffect(() => {
    // Animate tab transitions
    state.routes.forEach((_, i) => {
      Animated.spring(tabPositions[i], {
        toValue: i === state.index ? 1 : 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const getIconName = (routeName, isFocused) => {
    switch (routeName) {
      case 'Home':
        return {
          name: isFocused ? 'home' : 'home-outline',
          type: 'ionicon'
        };
      case 'ComplaintMap':
        return {
          name: isFocused ? 'map' : 'map-outline',
          type: 'ionicon'
        };
      case 'SubmitComplaint':
        return {
          name: 'add-circle',
          type: 'ionicon',
          size: 48
        };
      case 'Notifications':
        return {
          name: isFocused ? 'notifications' : 'notifications-outline',
          type: 'ionicon'
        };
      case 'Profile':
        return {
          name: isFocused ? 'person' : 'person-outline',
          type: 'ionicon'
        };
      default:
        return {
          name: 'help-circle',
          type: 'ionicon'
        };
    }
  };

  const renderIcon = (icon, isFocused, index) => {
    const { type, name, size = 22 } = icon;
    const color = isFocused ? '#0F766E' : '#A3A3A3';

    switch (type) {
      case 'ionicon':
        return <Ionicons name={name} size={size} color={color} />;
      case 'materialcommunity':
        return <MaterialCommunityIcons name={name} size={size} color={color} />;
      case 'fontawesome5':
        return <FontAwesome5 name={name} size={size} color={color} />;
      default:
        return <Ionicons name={name} size={size} color={color} />;
    }
  };

  // Center button special case
  const renderCenterButton = () => {
    const centerIndex = Math.floor(state.routes.length / 2);
    const centerRoute = state.routes[centerIndex];
    const { options } = descriptors[centerRoute.key];
    const isFocused = state.index === centerIndex;

    const icon = getIconName(centerRoute.name, isFocused);

    return (
      <TouchableOpacity
        key={centerRoute.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: centerRoute.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(centerRoute.name);
          }
        }}
        style={styles.centerButtonContainer}
      >
        <View style={styles.centerButton}>
          {renderIcon(icon, true, centerIndex)}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }
    ]}>
      {Platform.OS === 'ios' && (
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={80}
          tint="light"
        />
      )}

      <View style={styles.background} />

      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Center button special case
          if (index === Math.floor(state.routes.length / 2)) {
            return renderCenterButton();
          }

          const icon = getIconName(route.name, isFocused);

          // Animations
          const translateY = tabPositions[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, -3],
          });

          const scale = tabPositions[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1.05],
          });

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={styles.tabButton}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  {
                    transform: [
                      { translateY },
                      { scale }
                    ]
                  }
                ]}
              >
                {renderIcon(icon, isFocused, index)}

                {isFocused && (
                  <Text style={styles.tabLabel}>
                    {route.name.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                )}

                {isFocused && <View style={styles.activeIndicator} />}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Platform.OS === 'android' ? '#FFFFFF' : 'transparent',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    zIndex: 1000,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Platform.OS === 'android' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.92)',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: '#0F766E',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0F766E',
  },
  centerButtonContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -24,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default BottomNavigationBar;

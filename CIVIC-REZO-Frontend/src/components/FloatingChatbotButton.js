import React, { useRef, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  Text,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FloatingChatbotButton = ({ onPress, style }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Subtle breathe animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    // Hide tooltip after 4 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 4000);

    return () => {
      pulseAnimation.stop();
      clearTimeout(tooltipTimer);
    };
  }, []);

  const handlePress = () => {
    setShowTooltip(false);
    onPress();
  };

  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      {/* Pulse Ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            transform: [{ scale: pulseAnim }],
          }
        ]}
      />

      {/* Main Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.85}
        accessibilityLabel="Open CivicStack Assistant"
        accessibilityHint="Get help with app features and civic issues"
      >
        <MaterialCommunityIcons
          name="robot-happy-outline"
          size={26}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Tooltip */}
      {showTooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>Need help?</Text>
          <View style={styles.tooltipArrow} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
    top: -6,
    left: -6,
  },
  button: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  tooltip: {
    position: 'absolute',
    bottom: 68,
    right: 0,
    backgroundColor: '#171717',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -5,
    right: 18,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#171717',
  },
});

export default FloatingChatbotButton;

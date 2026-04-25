import React from 'react';
import { View, Text } from 'react-native';

const MapView = ({ children, style }) => (
  <View style={[style, { backgroundColor: '#e5e5e5', justifyContent: 'center', alignItems: 'center' }]}>
    <Text>Map not supported on Web</Text>
    <View style={{ display: 'none' }}>{children}</View>
  </View>
);

const Marker = ({ children }) => <View>{children}</View>;
const Circle = () => <View />;
const Callout = ({ children }) => <View>{children}</View>;

export { MapView, Marker, Circle, Callout };
export default MapView;

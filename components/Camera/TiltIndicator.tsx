import React, { useEffect, useState } from "react";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import { View, Text, StyleSheet } from "react-native";

export default function TiltIndicator() {
  const [tilt, setTilt] = useState({ pitch: 0, roll: 0 });

  useEffect(() => {
    const subscription = DeviceMotion.addListener(
      (data: DeviceMotionMeasurement) => {
        console.log(data);
        const pitch = data.rotation?.beta ?? 0;
        const roll = data.rotation?.gamma ?? 0;
        setTilt({ pitch, roll });
        console.log("pitch:", pitch, "roll:", roll);
      }
    );

    DeviceMotion.setUpdateInterval(1000);
    return () => subscription.remove();
  }, []);

  const isLevel = Math.abs(tilt.roll) < 0.1;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{isLevel ? "수평" : `기울어짐`}</Text>
      <Text style={styles.text}>roll: {tilt.roll.toFixed(2)}</Text>
      <Text style={styles.text}>pitch: {tilt.pitch.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 4,
    zIndex: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

const OrderPlacedSplash = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("NextScreen"); // Change to your next screen
    }, 3000); // Change duration as needed

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animatable.View animation="bounceIn" style={styles.tickContainer}>
        <Text style={styles.tick}>✔</Text>
      </Animatable.View>
      <Text style={styles.successText}>Subscribed Successfully!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tickContainer: {
    marginBottom: 20,
    fontSize: 100,
    color: "#4CAF50",
  },
  tick: {
    fontSize: 50,
    color: "#4CAF50",
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default OrderPlacedSplash;

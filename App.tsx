import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider as HolidayProvider } from "./context/HolidayContext";
import Holiday from './screen/holidays'
// provider qui wrap l'app pour avoir les données disponible dans toutes l'architecture
export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <HolidayProvider>
          <Holiday />
          {/* <Text>Open up App.tsx to start working on your app!</Text> */}
          <StatusBar style="auto" />
        </HolidayProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

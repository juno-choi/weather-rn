import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "5818433acc888aad8e36a014314b8c8d";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const { list } = await (
      await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    ).json();
    const daily = list.filter(({dt_txt}) => dt_txt.endsWith("00:00:00"));
    console.log(daily);
    setDays(daily);
  };
  useEffect(() => {
    ask();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
      {(days.length === 0 ? 
      (<View style={styles.day}>
        <ActivityIndicator color="white" size="large"></ActivityIndicator>
      </View>)
      :( 
        days.map((day, index) => 
          <View key={index} style={styles.day}>
            <Text style={styles.day_string}>{day.dt_txt.toString().substring(0,10)}</Text>
            <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
            <Text style={styles.main}>{day.weather[0].main}</Text>
            <Text style={styles.description}>{day.weather[0].description}</Text>
          </View>
        ))
      )}
        
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 178,
  },
  main: {
    marginTop: -30,
    fontSize: 60,
  },
  description: {
    fontSize: 20,
  },
  day_string: {
    fontSize: 50,
  }
});
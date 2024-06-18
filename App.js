import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "5818433acc888aad8e36a014314b8c8d";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

const weather = {
  Clouds: "구름낌",
  Clear: "맑음",
  Atmosphere: "흐리고 바람",
  Snow: "눈",
  Rain: "비",
  Drizzle: "이슬비",
  Thunderstorm: "천둥번개",
};

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
            <Text style={styles.date}>{getDate(day.dt_txt.toString())}</Text>
            <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
            <Fontisto style={{marginTop: -20}} name={icons[day.weather[0].main]} size={68} color="white" />
            <Text style={styles.main}>{weather[day.weather[0].main]}</Text>
          </View>
        ))
      )}
        
      </ScrollView>
    </View>
  );
}

const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function getDate(input_date) {
  let resultDate = '';
  resultDate = input_date.substring(0,10);
  const date = new Date(resultDate);
  const month = date.getMonth() + 1; // 월 (0부터 시작하므로 1을 더함)
  const day = date.getDate(); // 일
  const dayOfWeek = daysOfWeek[date.getDay()]; // 요일

  resultDate = `${month}월 ${day}일 ${dayOfWeek}`;
  return resultDate;
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
    color: "white",
  },
  weather: {

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 120,
    color: "white",
  },
  main: {
    marginTop: -10,
    fontSize: 50,
    color: "white",
  },
  description: {
    fontSize: 20,
  },
  date: {
    fontSize: 40,
    color: "white",
    alignItems: "center",
  }
});
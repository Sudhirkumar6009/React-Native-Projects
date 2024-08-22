import { ActivityIndicator, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View} from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';


const WeatherService = () => {
  const [city, setCity] = useState('');
  const [temp, setTemp] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);
  const [weatherText, setWeatherText] = useState<string | null>(null);
  const [tempFeel, setTempFeel] = useState<string | null>(null);
  const [humidity, setHumidity] = useState<string | null>(null);
  const [windSpeed, setWindSpeed] = useState<string | null>(null);
  const [precipitation, setPrecipitation] = useState<string | null>(null);
  const [pressure, setPressure] = useState<string | null>(null);
  const [UVIndex, setUVIndex] = useState<string | null>(null);
  const [sunrise, setSunrise] = useState<string | null>(null);
  const [sunset, setSunset] = useState<string | null>(null);
  const [zenithTime, setZenithTime] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayBtn, setDisplayBtn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const colorscheme = useColorScheme();

  const bgImage = () => {
    switch (weatherText) {
      case 'Light rain shower':
        return require('../assets/backgrounds/light_rain_shower.jpg');
      case 'Patchy rain nearby':
        return require('../assets/backgrounds/patchy_rain_nearby.jpg');
      case 'Partly cloudy ':
        return require('../assets/backgrounds/partly_cloudy.jpg');
      case 'Clear ':
        return require('../assets/backgrounds/clear.jpg');
      case 'Sunny':
        return require('../assets/backgrounds/sunny.jpg');
      case 'Patchy light rain in area with thunder':
        return require('../assets/backgrounds/rain_with_thunder.jpg');
      case 'Moderate or heavy rain shower':
        return require('../assets/backgrounds/moderate_heavy_rain.jpg');
      default:
        return require('../assets/backgrounds/default.jpg');
    }
  }

  const bgColor = () => {
    switch (weatherText) {
      case "Light rain shower":
        return (
          {backgroundColor: '#BCCEDD'}
        )
      case "Patchy rain nearby":
        return (
          {backgroundColor: '#788EB2'}
       )
      case "Partly cloudy ":
        return (
          {backgroundColor: '#6A6B70'}
        )
      case "Clear ":
        return (
          {backgroundColor: '#1571E0'}
       )
      case "Sunny":
        return (
          {backgroundColor: '#4D6A12'}
       )
      case "Patchy light rain in area with thunder":
        return (
          {backgroundColor: '#2C3D64'}
       )
       case "Moderate or heavy rain shower":
         return (
           {backgroundColor: '#548235'}
        )
    }
  }
  const displayModal = (id: string) => {
    let message = '';
    switch (id) {
      case '1':
        message = 'Weather conditions describe the state of the atmosphere at a given time and place, influencing how we experience the environment daily. These conditions can vary widely, affecting visibility, temperature, and overall comforts';
        break;
      case '2':
        message = 'Feel-like temperature, also known as "apparent temperature," refers to how the temperature feels to the human body when factoring in various atmospheric conditions like humidity, wind, and sunshine. This can differ significantly from the actual air temperature.';
        break;
      case '3':
        message = 'Humidity measures the amount of moisture in the air and impacts how temperature feels. When it feels dry, the air has low moisture, creating a crisp and comfortable sensation. Feels humid means the air is noticeably moist, leading to a sticky and uncomfortable feeling, while feels very humid indicates a high level of moisture that makes the environment feel oppressive and damp.';
        break;
      case '4':
        message = 'Wind speed refers to how fast the air is moving and affects how temperature and weather conditions are perceived. When wind is light, it creates a gentle breeze, often making conditions feel more pleasant. Moderate wind indicates a noticeable breeze that can be refreshing but not disruptive. Strong wind results in a powerful airflow that can make conditions feel cooler and more challenging, while very strong wind creates intense gusts that can impact outdoor activities and create a sense of harshness.'
        break;
      case '5':
        message = 'Precipitation describes the amount and type of water falling from the sky, including rain, snow, sleet, or hail. When precipitation is light, it involves minimal water, like a brief drizzle or light snow. Moderate precipitation means a more consistent and noticeable amount of water, such as steady rain or snow. Heavy precipitation involves significant amounts of water, leading to intense rain, snowstorms, or hail, which can impact visibility and cause flooding.';
        break;
      case '6':
        message = 'Pressure refers to the force exerted by the atmosphere and influences weather patterns and comfort. Low pressure typically indicates stormy or unsettled weather, often associated with increased humidity and cloudiness. High pressure generally signals clear skies and stable conditions, leading to dry and calm weather.';
        break;
      case '7':
        message = 'The UV Index measures the strength of ultraviolet (UV) radiation from the sun, impacting how quickly sunburn can occur. A low UV Index means minimal risk of harm from unprotected sun exposure. A high UV Index indicates a greater risk of sunburn and potential skin damage, requiring protective measures like sunscreen or clothing. A very high UV Index signifies an intense level of UV radiation, making it crucial to take strong precautions to protect skin and eyes.';
        break;
      case '8':
        message = 'Sunrise is the moment the sun first appears above the horizon, marking the beginning of the day and the gradual increase in light.';
        break;
      case '9':
        message = 'Sunset occurs when the sun drops below the horizon, signifying the end of daylight and the onset of evening.';
        break;
      case '10':
        message = 'Zenith Time is when the sun reaches its highest point in the sky, providing the peak of daylight intensity and the shortest shadow length.';
        break;
      case '11':
        message = "This displays currrent static time when data fetched, with it's timezone";
        break;
      default:
        message = '';
    }
    setModalMessage(message);
    setModalVisible(true);
  };

  const fetchTemperature = async () => {
    try {
      setDisplayBtn(true)
      setLoading(true);
      setError(null);
      const weather = await axios.get(`https://www.wttr.in/${city}?format=%c`);
      const weatherText = await axios.get(`https://www.wttr.in/${city}?format=%C`);
      const temp = await axios.get(`https://www.wttr.in/${city}?format=%t`);
      const tempFeel = await axios.get(`https://www.wttr.in/${city}?format=%f`);
      const humidity = await axios.get(`https://www.wttr.in/${city}?format=%h`);
      const windSpeed = await axios.get(`https://www.wttr.in/${city}?format=%w`);
      const location = await axios.get(`https://www.wttr.in/${city}?format=%l`);
      const precipitation = await axios.get(`https://www.wttr.in/${city}?format=%p`);
      const pressure = await axios.get(`https://www.wttr.in/${city}?format=%P`);
      const UVIndex = await axios.get(`https://www.wttr.in/${city}?format=%u`);
      const sunrise = await axios.get(`https://www.wttr.in/${city}?format=%S`);
      const sunset = await axios.get(`https://www.wttr.in/${city}?format=%s`);
      const currentTime = await axios.get(`https://www.wttr.in/${city}?format=%T`);
      const zenithTime = await axios.get(`https://www.wttr.in/${city}?format=%z`);

      setTemp(temp.data)
      setWeather(weather.data)
      setWeatherText(weatherText.data)
      setTempFeel(tempFeel.data)
      setHumidity(humidity.data)
      setWindSpeed(windSpeed.data)
      setPrecipitation(precipitation.data)
      setPressure(pressure.data)
      setUVIndex(UVIndex.data)
      setSunrise(sunrise.data)
      setSunset(sunset.data)
      setZenithTime(zenithTime.data)
      setLocation(location.data)
      setCurrentTime(currentTime.data)
    } catch (err: any) {
      setError("No City available from Provided name");
    } finally {
      setLoading(false);
    }
  };
  const clearTextData = () => {
    setCity('')
    setDisplayBtn(false)
  }  
  
  return (
    <View >
      <StatusBar barStyle={colorscheme === 'dark' ? "dark-content" : "light-content"} translucent backgroundColor={'#0099e6'} />
      <ScrollView>
      <ImageBackground source={bgImage()} style={styles.bgImage}>
      <TextInput
        style={styles.inputLight}
        placeholder="Enter city name"
        value={city}
        onChangeText={(text) => setCity(text)}
        onFocus={() => displayBtn}
        />
      <TouchableOpacity style={{position:'absolute',alignSelf:'flex-end',paddingTop:64,paddingEnd:32}}>
      <Icon name='close' size={20} onPress={clearTextData} style={{color:'black'}}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonLight} onPress={fetchTemperature}>
        <Text style={{color:'white',fontSize:20,fontWeight:'500',letterSpacing:0.9}}>FETCH FORECAST DATA</Text>

      </TouchableOpacity>
      {loading && <ActivityIndicator color={'white'} style={{position:'absolute',marginHorizontal:35,marginTop:135}}/>}
      {error && <Text>Error: {error}</Text>}
      {weatherText !== 'Patchy light rain in area with thunder' && weatherText !== 'Moderate or heavy rain shower' ? (<Text style={{fontSize:130,marginStart:50,color:'black',alignSelf:'center'}}>{weather}</Text>) : <Text style={{fontSize:130,marginStart:50,marginBottom:15,color:'white',alignSelf:'center',}}>{weather}</Text>}
      {temp && <Text style={styles.tempLight}>{temp}</Text>}
      
      {/* 1 */}
      {(weather || weatherText || tempFeel) && 
      <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={() => displayModal('1')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:90,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            {weatherText && weatherText !== 'Patchy light rain in area with thunder' && weatherText !== 'Moderate or heavy rain shower' ? <Text style={{color:'black',fontWeight:'500',fontSize:18,textAlign:'center',paddingTop:20,paddingStart:4,paddingEnd:4,letterSpacing:0.5}}>{weatherText}</Text> : <Text style={{color:'black',textAlign:'center',fontWeight:'500',fontSize:15.6,paddingTop:20,paddingStart:4,paddingEnd:4,letterSpacing:0.5}}>{weatherText}</Text>}
            {weatherText !== 'Patchy light rain in area with thunder' ? <Text style={{color:'black',fontWeight:'900',fontSize:50,marginTop:10,marginStart:20,}}>{weather}</Text> : <Text style={{color:'white',fontWeight:'500',fontSize:50,marginTop:0,marginStart:20}}>{weather}</Text>}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={() => displayModal('2')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:85,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            <Text style={{color:'black',fontWeight:'500',fontSize:20,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>Feel Like</Text> 
            {tempFeel && <Text style={{color:'black',fontWeight:'500',fontSize:35,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>{tempFeel}</Text> }
        </View>
      </TouchableOpacity>
      </View>
      }

      </ImageBackground>
        <View style={bgColor()}>
      {/* 2 */}
      {(humidity || windSpeed) && 
      <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>      
          <TouchableOpacity onPress={() => displayModal('3')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:80,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            <Text style={{color:'black',fontWeight:'500',fontSize:18,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>Humidity</Text>
            {humidity && <Text style={{color:'black',fontWeight:'500',fontSize:35,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>{humidity}</Text> }
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={() => displayModal('4')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:75,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            <Text style={{color:'black',fontWeight:'500',fontSize:20,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>Wind Speed</Text> 
            {windSpeed && <Text style={{color:'black',fontWeight:'500',fontSize:28,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>{windSpeed}</Text> }
        </View>
      </TouchableOpacity>
      </View>
      }

      {/* 3 */}
      {(precipitation || pressure) &&
      <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={() => displayModal('5')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:75,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            <Text style={{color:'black',fontWeight:'500',fontSize:20,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>Precipitation</Text> 
            {precipitation && <Text style={{color:'black',fontWeight:'500',fontSize:35,marginTop:10}}>{precipitation}</Text> }
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={() => displayModal('6')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:75,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            <Text style={{color:'black',fontWeight:'500',fontSize:20,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>Pressure</Text> 
            {pressure && <Text style={{color:'black',fontWeight:'500',fontSize:30,paddingTop:15,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>{pressure}</Text> }
        </View>
      </TouchableOpacity>
      </View>
      }

      {/* 4 */}
      {(UVIndex || sunrise) &&
      <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={() => displayModal('7')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:85,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            <Text style={{color:'black',fontWeight:'500',fontSize:20,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>UV Ray</Text> 
            {UVIndex && <Text style={{color:'black',fontWeight:'500',fontSize:40,marginTop:15}}>{UVIndex}</Text> }
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={() => displayModal('8')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:75,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            <Text style={{color:'black',fontWeight:'500',fontSize:20,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>Sunrise Time</Text> 
            {sunrise && <Text style={{color:'black',fontWeight:'500',fontSize:30,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>{sunrise}</Text> }
        </View>
      </TouchableOpacity>
      </View>
      }


      {/* 5 */}
      {(sunset || zenithTime) &&
      <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={() => displayModal('9')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:75,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            <Text style={{color:'black',fontWeight:'500',fontSize:20,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>Sunset Time</Text> 
            {sunset && <Text style={{color:'black',fontWeight:'500',fontSize:30,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>{sunset}</Text> }
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardsLight}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={() => displayModal('10')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:75,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            <Text style={{color:'black',fontWeight:'500',fontSize:20,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>Zenith Time</Text> 
            {zenithTime && <Text style={{color:'black',fontWeight:'500',fontSize:30,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>{zenithTime}</Text> }
        </View>
      </TouchableOpacity >
      </View>
      }

      {/* 6 */}
      {(location || currentTime) &&
      <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center',marginTop:15,marginBottom:30,elevation:5,}}>
      <TouchableOpacity style={styles.cardsLastLight}>
          <View style={{alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={() => displayModal('11')} style={{position:'absolute',alignSelf:'flex-end',paddingBottom:75,paddingEnd:5}}>
            <Icon name='info' size={20}/>
            </TouchableOpacity>
            {location && <Text style={{color:'black',fontWeight:'500',fontSize:20,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>{location} (Time-TimeZone)</Text> }
            {currentTime && <Text style={{color:'black',fontWeight:'500',fontSize:30,paddingTop:20,paddingStart:5,paddingEnd:5,letterSpacing:0.5}}>{currentTime}</Text> }
          </View>
      </TouchableOpacity>
      </View>
      }
       <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={{
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 25,
          alignItems: 'center'
        }}>
          <Text style={{ color: 'black', fontSize: 15, letterSpacing: 1 }}>
            {modalMessage}
          </Text>
        </View>
      </Modal>
      </View>
      </ScrollView>
      </View>
    );
  };
  
  export default WeatherService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
  },
  inputLight: {
    height: 50,
    borderColor: '#999999',
    borderWidth: 0.5,
    borderRadius:10,
    letterSpacing:0.9,
    paddingHorizontal:20,
    fontSize:20,
    paddingEnd:40,
    backgroundColor:'white',
    opacity:0.7,
    fontWeight:'500',
    elevation:10,
    marginTop:50,
    marginStart:20,
    marginEnd:20,
  },
  buttonLight:{
    height: 50,
    borderWidth: 0.5,
    borderRadius:10,
    backgroundColor:'#0099e6',
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
    elevation:10,
    marginStart:20,
    marginEnd:20,
  },
  tempLight:{
    fontSize:50,
    fontWeight:'800',
    letterSpacing:3,
    alignSelf:'center',
    color:'white',
  },
  cardsLight:{
    backgroundColor:'#f2f2f2',
    width:150,
    height:150,
    margin:15,
    borderColor:'grey',
    borderWidth:0.5,
    borderRadius:10,
    opacity:0.6,
  },
  cardsLastLight:{
    backgroundColor:'#f2f2f2',
    alignSelf:'center',
    height:150,
    width:330,
    borderRadius:10,
    opacity:0.5,
  },
  bgImage:{
    position:'relative',
    marginTop:30,
    marginBottom:-5
  },
});
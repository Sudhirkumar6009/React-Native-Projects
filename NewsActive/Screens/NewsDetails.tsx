import { FlatList, StyleSheet, Text, View, Image, StatusBar, ScrollView, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface NewsItem {
  id: number;
  title: string;
  text: string;
  url: string;
  image?: string;
  publish_date: string;
  author: string | null;
}

type NewsDetailRouteProp = RouteProp<{ params: { newsItem: NewsItem } }, 'params'>;

const NewsDetail: React.FC = () => {
  const route = useRoute<NewsDetailRouteProp>();
  const { newsItem } = route.params;
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={colorScheme === 'light' ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <View style={{marginBottom:10}}/>
      <Text style={styles.title}>{newsItem.title}</Text>
      {newsItem.image && <Image source={{ uri: newsItem.image }} style={styles.image} />}
      <Text style={styles.desc} numberOfLines={25}>{newsItem.text}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(newsItem.url)} style={styles.readMoreButton}>
          <View style={{flexDirection:'row'}}>
               <Text style={styles.readMoreText}>READ MORE</Text>
               <Icon name='external-link' size={20} color={'white'} style={{paddingStart: 10,paddingTop:3}}/>
          </View>
             </TouchableOpacity>
      <Text style={styles.author}>{newsItem.author ? `By ${newsItem.author}` : 'No author'}</Text>
      <Text style={styles.publishDate}>{new Date(newsItem.publish_date).toLocaleDateString()}</Text>
      </ScrollView>
    </View>
  );
};

export default NewsDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: 200,
    width: '93%',
    borderRadius: 15,
    margin:15
  },
  title: {
    fontSize: 23,
    fontWeight: '600',
    color: '#008039',
    textAlign:'justify',
    marginTop:5,
    margin: 15,
    letterSpacing:0.7,
    lineHeight:30
  },
  desc: {
    fontSize: 16,
    margin: 15,
    textAlign: 'justify',
    color: 'black',
    lineHeight:25,
  },
  readMoreButton: {
     backgroundColor: '#00863D',
     borderRadius: 8,
     margin: 20,
     padding:20,
     alignItems: 'center',
   },
   readMoreText: {
     color: 'white',
     fontSize:18,
     letterSpacing:2,
     fontWeight: '900',
   },
  author: {
    fontSize: 16,
    fontStyle: 'italic',
    marginEnd: 20,
    marginBottom:10,
    marginTop:10,
    color: 'black',
    alignSelf:'flex-end',
    fontWeight:'800'
  },
  publishDate: {
    fontSize: 14,
    color: 'gray',
    marginEnd: 20,
    marginBottom:10,
    marginTop:10,
    alignSelf:'flex-end'
  },
});

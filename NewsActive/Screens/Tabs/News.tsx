import { FlatList, Image, Linking, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import NetworkService from '../NewsAPIConfiguration/NewsService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  NewsDetails: { newsItem: NewsItem };
};

type NewsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewsDetails'>;

interface NewsItem {
     id: number;
     title: string;
     text: string;
     url: string;
     image?: string;
     publish_date: string;
     author: string | null;
   }

   const News: React.FC = () => {
     const [news, setNews] = useState<NewsItem[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [refreshing, setRefreshing] = useState(false);

     const navigation = useNavigation<NewsScreenNavigationProp>();
   
     const fetchNews = async () => {
      setLoading(true);
      try {
        const fetchedNews = await NetworkService.fetchNews();
        setNews(fetchedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
   
  useEffect(() => {
    fetchNews();
  }, []);
   
     const onRefresh = async () => {
       setRefreshing(true);
       await fetchNews();
     };

     return (
       <View style={{marginBottom:90}}>
       <FlatList
         data={news}
         style={{backgroundColor:'white'}}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({ item }) => (
             <View style={styles.newsItem}>
             {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
             <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
             <Text style={styles.description} numberOfLines={3}>{item.text}</Text>
             <TouchableOpacity
                onPress={() => navigation.navigate('NewsDetails', { newsItem: item })}
                style={styles.readMoreButton}
              >
                <Text style={styles.readMoreText}>READ CONTENT</Text>
              </TouchableOpacity>

             <Text style={styles.author}>{item.author ? `By ${item.author}` : 'No author'}</Text>
             <Text style={styles.publishDate}>{new Date(item.publish_date).toLocaleDateString()}</Text>
           </View>
         )}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressBackgroundColor={'#00863d'} colors={['#ffffff', '#80ffb9', '#33ff8f']}/>}
         />
       </View>
     );
   };

export default News

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: 'white',
        },
        header: {
          position: 'absolute',
          top: 35,
          left: 0,
          right: 0,
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          zIndex: 1,
        },
        headerText: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
        },
        profileBtn: {
          backgroundColor: 'gray',
          borderRadius: 50,
          padding: 5,
        },
        profileImg: {
          width: 40,
          height: 40,
          borderRadius: 20,
        },
        backgroundImage: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        newsItem: {
          margin: 10,
          padding: 10,
          backgroundColor: 'white',
          borderRadius: 10,
          elevation: 10,
          shadowColor:'#00863d'
        },
        image: {
          height: 100,
          width: '100%',
          borderRadius: 10,
        },
        title: {
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 5,
          textAlign:'justify',
          color:'#00863d',
          margin:7
        },
        description: {
          fontSize: 15,
          textAlign:'justify',
          marginVertical: 5,
          margin:7
        },
        readMoreButton: {
          backgroundColor: '#00863D',
          borderRadius: 8,
          padding: 8,
          marginTop: 10,
          alignItems: 'center',
        },
        readMoreText: {
          color: 'white',
          fontWeight: '600',
        },
        author: {
          fontSize: 12,
          fontWeight: 'bold',
          marginTop: 5,
          alignSelf:'flex-end'
        },
        publishDate: {
          fontSize: 10,
          color: 'gray',
          alignSelf:'flex-end'
        },
})
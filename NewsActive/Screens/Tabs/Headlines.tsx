import { FlatList, Image, Linking, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import NetworkService from '../NewsAPIConfiguration/NewsService';
import Icon from 'react-native-vector-icons/FontAwesome';


interface HeadlineNews {
     id: number;
     title: string;
     url: string;
     image?: string;
     publish_date: string;
     author: string | null;
   }
   
const Headlines: React.FC = () => {
     const [headlines, setHeadlines] = useState<HeadlineNews[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [refreshing, setRefreshing] = useState(false);
   
     const fetchHeadlines = async () => {
       setLoading(true);
       try {
         const fetchedHeadlines = await NetworkService.fetchHeadlines();
         setHeadlines(fetchedHeadlines);
       } catch (error) {
         console.error('Error fetching headlines:', error);
       } finally {
         setLoading(false);
         setRefreshing(false);
       }
     };
   
     useEffect(() => {
       fetchHeadlines();
     }, []);

     const onRefresh = async () => {
      setRefreshing(true);
      await fetchHeadlines();
    };
   
     return (
      <>
       <FlatList
          style={{backgroundColor:'white'}}
         data={headlines}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({ item }) => (
           <View style={styles.newsItem}>
            <View style={{flexDirection:'row'}}>
             {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
             <View style={{flexDirection:'column'}}>
             <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
             <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={styles.readMoreButton}>
              <View style={{flexDirection:'row'}}>
               <Text style={styles.readMoreText}>READ MORE</Text>
               <Icon name='external-link' size={20} color={'white'} style={{paddingStart: 10,paddingTop:3}}/>
              </View>
             </TouchableOpacity>
             </View>
            </View>
             <Text style={styles.author}>{item.author ? `By ${item.author}` : 'No author'} | <Text style={styles.publishDate}>{new Date(item.publish_date).toLocaleDateString()}</Text></Text>
             
           </View>
         )}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressBackgroundColor={'#00863d'} colors={['#ffffff', '#80ffb9', '#33ff8f']}/>}
         />
       <View style={{height:90}} />
      </>
      );
   };

export default Headlines

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
          height: 125,
          width: '30%',
          borderRadius: 10,
        },
        title: {
          fontSize: 16,
          fontWeight: 'bold',
          marginVertical: 5,
          marginStart:10,
          width:240,
        },
        description: {
          fontSize: 14,
          marginVertical: 5,
        },
        readMoreButton: {
          backgroundColor: '#00863D',
          borderRadius: 8,
          width:'50%',
          marginTop: 10,
          alignItems: 'center',
          alignSelf:'center',
          paddingStart:20,
          paddingEnd:20,
          paddingTop:5,
          paddingBottom:5,
        },
        readMoreText: {
          color: 'white',
          fontWeight: '600',
          paddingTop:2,
        },
        author: {
          fontSize: 13,
          fontWeight: '700',
          marginTop: 5,
          alignSelf:'flex-end'
        },
        publishDate: {
          fontSize: 10,
          color: 'gray',
          alignSelf:'flex-end'
        },
})
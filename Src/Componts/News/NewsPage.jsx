import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const SMART_KEYWORDS = [
 'smart traffic lights',
  'traffic automation',
  'intelligent traffic systems',
  'smart transportation',
  'automated traffic control',
  'adaptive traffic signals',
  'traffic signal automation',
  'urban mobility solutions',
  'autonomous traffic management',
  'vehicle-to-infrastructure (V2I)',
  'connected traffic systems',
  'traffic flow optimization',
  'AI traffic monitoring',
  'smart intersections',
  'traffic robotics',
  'urban traffic control system',
  'intelligent transport systems (ITS)',
  'real-time traffic analytics',
  'automated incident detection',
  'smart mobility',
  'robotics',
  'robots',
  'autonomous robots',
  'industrial robots',
  'service robots',
  'collaborative robots',
  'cobots',
  'robotic automation',
  'smart robotics',
  'robotics engineering',
  'robotic process automation',
  'RPA',
  'humanoid robots',
  'robot vision',
  'AI robotics',
  'robot sensors',
  'robot navigation',
  'drone robotics',
  'warehouse robots',
  'automated guided vehicles'
];

const NewsPage = () => {
  const { userid } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook to check if screen is focused
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});

  // Memoize API_URL to prevent recalculation unless necessary
  const { API_URL } = useMemo(() => {
    const kw = SMART_KEYWORDS[Math.floor(Math.random() * SMART_KEYWORDS.length)];
    return {
      API_URL: `https://newsdata.io/api/1/news?apikey=pub_80386b7c84f060fd62af001ffea858ebda53d&q=${encodeURIComponent(kw)}&language=en`,
    };
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    const fetchArticles = async () => {
      if (!isFocused || !isMounted) return; // Skip if not focused or unmounted
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        if (response.data.status === 'success' && isMounted) {
          setArticles(response.data.results);
        } else if (isMounted) {
          throw new Error('Failed to fetch news');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error fetching news');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticles();

    // Cleanup to prevent updates after unmount
    return () => {
      isMounted = false;
    };
  }, [API_URL, isFocused]); // Depend on isFocused to re-run only when focus changes

  useEffect(() => {
    const loadLikes = async () => {
      if (!userid) return;
      try {
        const storedLikes = await AsyncStorage.getItem(`likes_${userid}`);
        if (storedLikes) setLikes(JSON.parse(storedLikes));
      } catch (err) {
        console.error('Error loading likes:', err);
      }
    };

    loadLikes();
  }, [userid]);

  const saveLikes = async (newLikes) => {
    if (!userid) return;
    try {
      await AsyncStorage.setItem(`likes_${userid}`, JSON.stringify(newLikes));
    } catch (err) {
      console.error('Error saving likes:', err);
    }
  };

  const handleLike = async (articleId) => {
    if (!userid) {
      Alert.alert('Error', 'Please log in to like articles.');
      return;
    }

    const likeData = likes[articleId];
    if (likeData) {
      const hoursSinceLike = (Date.now() - likeData.timestamp) / (1000 * 60 * 60);
      if (hoursSinceLike < 24) {
        Alert.alert('Hold On!', `You can like again in ${(24 - hoursSinceLike).toFixed(1)} hours.`);
        return;
      }
    }

    const newLikes = {
      ...likes,
      [articleId]: { liked: true, timestamp: Date.now() },
    };
    setLikes(newLikes);
    await saveLikes(newLikes);
    Alert.alert('Success', 'You liked this article!');
  };

  const renderArticle = ({ item }) => (
    <View style={styles.card}>
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      )}
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.navigate('NewsDetail', { article: item })}
        >
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
        <Text style={styles.description} numberOfLines={3}>
          {item.description || 'No description available.'}
        </Text>
        <Text style={styles.source}>{item.source_name}</Text>
        <Text style={styles.date}>
          {new Date(item.pubDate).toLocaleDateString()}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLike(item.article_id || item.link)}
          >
            <Ionicons
              name={
                likes[item.article_id || item.link]?.liked
                  ? 'heart'
                  : 'heart-outline'
              }
              size={24}
              color={
                likes[item.article_id || item.link]?.liked ? '#FF6F61' : '#6C63FF'
              }
            />
            <Text style={styles.likeText}>
              {likes[item.article_id || item.link]?.liked ? 'Liked' : 'Like'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={() => Linking.openURL(item.link)}
          >
            <Text style={styles.readMoreText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>IoT News</Text>
      {loading && (
        <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && articles.length === 0 && (
        <Text style={styles.noData}>No news articles found.</Text>
      )}
      {!loading && !error && articles.length > 0 && (
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.article_id || item.link}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6C63FF',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 10,
  },
  source: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '500',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
  likeText: {
    fontSize: 14,
    color: '#6C63FF',
    marginLeft: 5,
  },
  readMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FF6F61',
  },
  readMoreText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    color: '#FF6F61',
    textAlign: 'center',
    marginTop: 20,
  },
  noData: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
});

export default NewsPage;
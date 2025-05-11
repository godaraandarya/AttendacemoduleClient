import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

const NewsDetail = ({ route }) => {
  const { article } = route.params;

  if (!article) return <Text>No article data</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {article.image_url && (
        <Image source={{ uri: article.image_url }} style={styles.image} />
      )}
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.source}>{article.source_name}</Text>
      <Text style={styles.date}>
        {new Date(article.pubDate).toLocaleDateString()}
      </Text>
      {article.description ? (
        <Text style={styles.content}>{article.description}</Text>
      ) : (
        <View style={styles.webviewContainer}>
          <WebView source={{ uri: article.link }} style={styles.webview} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  source: {
    fontSize: 14,
    color: '#6C63FF',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
  },
  webviewContainer: {
    height: Dimensions.get('window').height * 0.8,
    marginTop: 10,
  },
  webview: {
    flex: 1,
  },
});

export default NewsDetail;

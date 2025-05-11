import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';

const HelpCenterScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>GA Applications Help Center</Text>
      
      <Text style={styles.welcomeText}>
        Welcome to the GA Applications Help Center. We're here to assist you with all your questions about our smart automation solutions.
      </Text>

      {/* Company Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company</Text>
        <Text style={styles.sectionContent}>
          GA Applications is a leading IoT company specializing in smart automation technologies. We are dedicated to enhancing your life and business through innovative, reliable, and efficient solutions.
        </Text>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionContent}>
          Have a question or need support? Reach out to us!
        </Text>
        <Text style={styles.contactItem}>
          Email:{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('mailto:home@gaapplications.com')}>
            home@gaapplications.com
          </Text>
        </Text>
        <Text style={styles.contactItem}>
          Phone: [Insert Contact Number Here]
        </Text>
        <Text style={styles.contactItem}>
          Hours: Monday - Friday, 9:00 AM - 5:00 PM (EST)
        </Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionContent}>
          At GA Applications, we design and deliver cutting-edge IoT solutions to make automation simple, smart, and accessible. Whether it’s for your home or business, our products are built to streamline processes and improve efficiency.
        </Text>
      </View>

      {/* Terms of Service Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Terms of Service</Text>
        <Text style={styles.sectionContent}>
          Our Terms of Service outline the rules and guidelines for using GA Applications’ products and services. By engaging with us, you agree to these terms.
        </Text>
      </View>

      {/* Privacy Policy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <Text style={styles.sectionContent}>
          Your privacy matters to us. Our Privacy Policy explains how we collect, use, and protect your personal information when you interact with GA Applications.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  contactItem: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default HelpCenterScreen; 
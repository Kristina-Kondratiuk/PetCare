import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Welcome() {
  return (
    <LinearGradient
  colors={['#C9F8FF', '#FFFFFF']}
  style={styles.container}
>
      <Text style={styles.title}>Witaj w PetCare</Text>

      <Text style={styles.subtitle}>
        Dbaj o zdrowie i szczęście swojego{'\n'}pupila każdego dnia
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Rozpocznij</Text>
      </TouchableOpacity>

      <Image
        source={require('../assets/images/cats.png')}
        style={styles.image}
        resizeMode="contain"
        
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0044FF',
    marginTop: 300,
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0044FF',
    height: 56,
    width: 335,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 19,
    color: '#ffffff',
    fontWeight: '600',
  },
  image: {
    width: 430,
    height: 300,
    position: 'absolute',
    bottom: -20,
  },
});
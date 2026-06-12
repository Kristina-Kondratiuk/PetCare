import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
    return (
        
        <View style={styles.container}>
        <Text style={styles.text}>Logowanie</Text>

        <TextInput
            style={styles.input}
            placeholder="Login"
            placeholderTextColor="#676767"
        />

        <TextInput
            style={styles.input}
            placeholder="Hasło"
            placeholderTextColor="#676767"
            secureTextEntry
        />

        <TouchableOpacity style={styles.button}>
            <Text style={styles.textButton}>Zaloguj się</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.registerText}>Zarejestruj się</Text>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0044FF',
    marginBottom: 30,
    
  },
  input: {
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    height: 56,
    width: 335,
    borderRadius: 11,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0044FF',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0044FF',
    height: 56,
    width: 335,
    borderRadius: 11,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontSize: 19,
    color: '#ffffff',
    fontWeight: '600',
  },
  registerText: {
  fontSize: 16,
  color: '#000000',
  textDecorationLine: 'underline',
},
});
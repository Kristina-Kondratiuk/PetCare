import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Register() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rejestracja</Text>

      <TouchableOpacity onPress={pickImage} style={styles.avatar}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarPlaceholder}>+</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.addPhotoText}>Dodaj zdjęcie</Text>

      <TextInput style={styles.input} placeholder="Imię" placeholderTextColor="#676767" />
      <TextInput style={styles.input} placeholder="Nazwisko" placeholderTextColor="#676767" />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#676767" />
      <TextInput style={styles.input} placeholder="Hasło" placeholderTextColor="#676767" secureTextEntry />
      <TextInput style={styles.input} placeholder="Powtórz hasło" placeholderTextColor="#676767" secureTextEntry />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.textButton}>Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0044FF',
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    fontSize: 44,
    color: '#ffffff',
  },
  addPhotoText: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    color: '#000000',
  },
  input: {
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    height: 48,
    width: 335,
    borderRadius: 11,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0044FF',
    height: 56,
    width: 335,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  textButton: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
});
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import { MoveLeft } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditPetProfile() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('Miki');
  const [type, setType] = useState('Pies');
  const [breed, setBreed] = useState('Beagle');
  const [birthDate, setBirthDate] = useState('15.04.2021 (5 lat)');
  const [weight, setWeight] = useState('12 kg');
  const [description, setDescription] = useState(
    'Przyjazny i energiczny beagle, który uwielbia długie spacery, zabawy na świeżym powietrzu oraz poznawanie nowych przyjaciół.'
  );

  const pickImageFromGallery = async () => {
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

  const takePhotoWithCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Dodaj zdjęcie', 'Wybierz źródło zdjęcia', [
      { text: 'Galeria', onPress: pickImageFromGallery },
      { text: 'Aparat', onPress: takePhotoWithCamera },
      { text: 'Anuluj', style: 'cancel' },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      const loadPetProfile = async () => {
        const savedPet = await AsyncStorage.getItem('petProfile');

        if (savedPet) {
          const petData = JSON.parse(savedPet);

          setImage(petData.image ?? null);
          setName(petData.name ?? 'Miki');
          setType(petData.type ?? 'Pies');
          setBreed(petData.breed ?? 'Beagle');
          setBirthDate(petData.birthDate ?? '15.04.2021 (5 lat)');
          setWeight(petData.weight ?? '12 kg');
          setDescription(
            petData.description ??
              'Przyjazny i energiczny beagle, który uwielbia długie spacery, zabawy na świeżym powietrzu oraz poznawanie nowych przyjaciół.'
          );
        }
      };

      loadPetProfile();
    }, [])
  );

  const savePetProfile = async () => {
    const petData = {
      image,
      name,
      type,
      breed,
      birthDate,
      weight,
      description,
    };

    await AsyncStorage.setItem('petProfile', JSON.stringify(petData));

    router.replace('/pet-profile');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MoveLeft size={36} color="#0044FF" strokeWidth={1.5} />
        </TouchableOpacity>

        <Text style={styles.title}>Ustawienia profilu</Text>
      </View>

      <TouchableOpacity style={styles.avatar} onPress={showImageOptions}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarPlaceholder}>+</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={showImageOptions}>
        <Text style={styles.addPhotoText}>Dodaj zdjęcie</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Opis</Text>
      <TextInput
        style={[styles.input, styles.description]}
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Imię</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Typ</Text>
      <TextInput style={styles.input} value={type} onChangeText={setType} />

      <Text style={styles.label}>Rasa</Text>
      <TextInput style={styles.input} value={breed} onChangeText={setBreed} />

      <Text style={styles.label}>Data urodzenia</Text>
      <TextInput
        style={styles.input}
        value={birthDate}
        onChangeText={setBirthDate}
      />

      <Text style={styles.label}>Waga</Text>
      <TextInput style={styles.input} value={weight} onChangeText={setWeight} />

      <TouchableOpacity style={styles.button} onPress={savePetProfile}>
        <Text style={styles.buttonText}>Zapisz zmiany</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 50,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 50,
    fontSize: 24,
    fontWeight: '700',
    color: '#0044FF',
  },
  avatar: {
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,

    borderWidth: 3,
    borderColor: '#FFFFFF',

    shadowColor: '#0044FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.52,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 71,
  },
  avatarPlaceholder: {
    fontSize: 44,
    color: '#ffffff',
  },
  addPhotoText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#000000',
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: '#676767',
    marginBottom: 5,
    marginLeft: 9,
  },
  input: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: '#0044FF',
    borderRadius: 11,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#0044FF',
    fontWeight: '600',
  },
  description: {
    minHeight: 80,
    maxHeight: 170,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  button: {
    minHeight: 52,
    borderRadius: 11,
    backgroundColor: '#0044FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
});
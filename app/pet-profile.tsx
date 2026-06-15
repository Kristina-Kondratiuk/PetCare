import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { MoveLeft, Pencil, Trash2 } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function PetProfile() {
  const [pet, setPet] = useState<any>(null);

useFocusEffect(
  useCallback(() => {
    const loadPetProfile = async () => {
      const savedPet = await AsyncStorage.getItem('petProfile');

      if (savedPet) {
        setPet(JSON.parse(savedPet));
      }
    };

    loadPetProfile();
  }, [])
);
    return ( 
    <View style={styles.container}> 
    <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <MoveLeft size={38} color="#0044FF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Profil pupila</Text>
    </View>

     <View style={styles.avatarWrapper}>
  {pet?.image ? (
    <Image source={{ uri: pet.image }} style={styles.avatarImage} />
  ) : (
    <Text style={styles.avatarPlaceholder}>+</Text>
  )}
</View>

 <Text style={styles.petName}>{pet?.name ?? 'Miki'}</Text>

      <View style={styles.info}>
        <Text style={styles.row}><Text style={styles.label}>Typ: </Text>{pet?.type ?? 'Pies'}</Text>
        <Text style={styles.row}><Text style={styles.label}>Rasa:</Text> {pet?.breed ?? 'Beagle'}</Text>
        <Text style={styles.row}><Text style={styles.label}>Data urodzenia:</Text> {pet?.birthDate ?? '15.04.2021 (5 lat)'}</Text>
        <Text style={styles.row}><Text style={styles.label}>Waga:</Text> {pet?.weight ?? '12 kg'}</Text>
      </View>

      <Text style={styles.descriptionTitle}>Opis:</Text>

      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionText}>
          {pet?.description ??
            'Przyjazny i energiczny beagle, który uwielbia długie spacery, zabawy na świeżym powietrzu oraz poznawanie nowych przyjaciół.'}
        </Text>
      </View>

       <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push('/edit-pet-profile')}
      >
        <Text style={styles.editButtonText}>Edytuj profil</Text>
        <Pencil size={22} color="#FFFFFF" strokeWidth={1.8} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Usuń pupila</Text>
        <Trash2 size={20} color="#0044FF" strokeWidth={1.8} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 50,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
  marginLeft: 80,
  fontSize: 24,
  fontWeight: '700',
  color: '#0044FF',
},
avatarWrapper: {
  width: 142,
  height: 142,
  borderRadius: 71,
  backgroundColor: '#E5E5E5',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,

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
  petName: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#0044FF',
    marginBottom: 30,
  },
  info: {
    marginBottom: 30,
  },
  row: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 13,
  },
  label: {
    color: '#0044FF',
    fontWeight: '700',
  },
  descriptionTitle: {
    fontSize: 18,
    color: '#0044FF',
    fontWeight: '700',
    marginBottom: 10,
  },
  descriptionBox: {
    borderWidth: 1.5,
    borderColor: '#0044FF',
    borderRadius: 11,
    padding: 15,
    paddingBottom: 0,
    marginBottom: 30,
  },
  descriptionText: {
    color: '#0044FF',
    fontSize: 13,
    lineHeight: 17,
  },
  editButton: {
    height: 52,
    borderRadius: 11,
    backgroundColor: '#0044FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
   editButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  deleteButton: {
    height: 52,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#0044FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
   deleteButtonText: {
    color: '#0044FF',
    fontSize: 17,
    fontWeight: '600',
  },
});

import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function login () {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Logowanie</Text>
            <TextInput style={styles.login} defaultValue="Login"/>
            <TextInput style={styles.password} defaultValue="Password"/>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.textButton}>Zaloguj się</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    text: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 60
    },
    login: {
        backgroundColor: '#676767',
        paddingLeft: 20,
        paddingVertical: 20,
        height: 90,
        width: 300,
        borderRadius: 60,
        marginBottom: 30
    },
    password: {
        backgroundColor: '#676767',
        paddingLeft: 20,
        paddingVertical: 20,
        height: 90,
        width: 300,
        borderRadius: 60,
        marginBottom: 30
    },
    button: {
        backgroundColor: '#B0FF8B',
        height: 90,
        width: 300,
        paddingHorizontal: 70,
        paddingVertical: 25,
        borderRadius: 60,
        marginBottom: 30
    },
    textButton: {
        fontSize: 30,
        color: '#000000',
        fontWeight: 'bold'
    }
})
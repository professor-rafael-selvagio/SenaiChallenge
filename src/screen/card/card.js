import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import {useNavigation} from '@react-navigation/native';

import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import api from '../../service/index.js';



export default function Card() {
    const [listQuestions, setListQuestions] = useState([]);
    const [theme, setTheme] = useState('');
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [visible, setVisible] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        questions();
    }, []);

    function closeCard(){
        navigation.navigate('Home');
    }

    function verificationCard() {
        if (!visible) {
            setVisible(true);
            questions();
        } else {
            setVisible(false); 
            setTimeout(() => {
                setVisible(true);
            questions();
            }, 1500);
        }
    }

    function random() {
        const res = listQuestions[Math.floor(Math.random() * listQuestions.length)];
        if (res !== undefined) {
            setTheme(res.tema);
            setQuestion(res.pergunta);
            setResponse(res.resposta);
            setVisible(true);
            return;
        }
    }

    async function questions() {
        await api.get('/question')
            .then(response => {
                setListQuestions(response.data);
            })
            .catch(erro => {
                console.error('error when making the request:' + erro);
            });
        random();
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.header}>
                    <Image style={styles.image} source={require('../../image/logoSenai.png')} />
                    <FontAwesome5 name="question-circle" size={32} color="#ff0808" />
                </View>
                {visible ? (
                    <View style={styles.body}>
                        <Animatable.View style={styles.bodyCardVisible}  animation='flipInY' >
                            <Text style={styles.bodyTitle}>Tema: {theme}</Text>
                            <Text style={styles.bodyQuestion}>{question}</Text>
                            <View style={styles.contentBodyResponse}>
                                <Text style={styles.bodyResponse}>{response}</Text>
                            </View>
                            
                        </ Animatable.View>
                    </View>
                ) : (
                    <Animatable.View style={styles.bodyCard} animation='fadeInUpBig'>
                        <Image style={styles.bodyCardImage} source={require('../../image/cardBack.png')} />
                    </Animatable.View>
                )}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={closeCard}>
                        <FontAwesome5 name="window-close" size={32} color="#ff0808" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={verificationCard}>
                        <MaterialCommunityIcons name="page-next" size={40} color="#ff0808" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        height: '20%',
        paddingTop: 50,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    image: {
        width: 120,
        height: 32,
    },
    body: {
        width: '100%',
        height: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    bodyCardVisible: {
        backgroundColor: '#ff0808',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        gap: 50,
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
    },
    bodyTitle: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',

    },
    bodyQuestion: {
        color: '#fff',
        fontSize: 30,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    contentBodyResponse:{
        backgroundColor: '#fff',
        width: '100%',
        height: '30%',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodyResponse: {
        color: '#ff0808',
        fontWeight: 'bold',
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',

    },
    bodyCard: {
        width: '100%',
        height: '60%',
        alignItems: 'center',
        gap: 50,
        justifyContent: 'center',
        padding: 10,
    },
    bodyCardImage: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    footer: {
        width: '100%',
        height: '20%',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    }
});

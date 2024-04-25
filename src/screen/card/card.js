import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import {useNavigation} from '@react-navigation/native';

import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import api from '../../service/index.js';

export default function Card() {
    const [indiceSort, setIndiceSort] = useState(-1);
    const [listQuestions, setListQuestions] = useState([]);
    const [theme, setTheme] = useState('');
    const [tipo, setTipo] = useState('');
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [responseV, setResponseV] = useState('');
    const [responseF, setResponseF] = useState('');
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
            random();
        } else {
            setVisible(false); 

            setTimeout(() => {
                setVisible(true);
                random();
            }, 1500);
        }
    }

    function getNextNumero() {
        proximoNumero = indiceSort + 1;

        if (proximoNumero == listQuestions.length){
            embaralhar(null);
            proximoNumero = 0;
        }

        setIndiceSort(proximoNumero);
        return proximoNumero;
    }
    

    function random() {
        indice = getNextNumero();
        const res = listQuestions[indice];
        
        if (res !== undefined) {
            setTheme(res.tema);
            setTipo(res.tipo);
            setQuestion(res.pergunta);
    
            if (res.tipo === "direta") {
                setResponse(res.resposta);
                setResponseV("");
                setResponseF("");
            } else {
                setResponse("");
                setResponseV(res.respostaV);
                setResponseF(res.respostaF);
            }
            
            setVisible(true);
        }
    }

    function embaralhar(listaDeCartas = null){
        if (listaDeCartas == null){
            listaDeCartas = listQuestions;
        }

        for (let i = listaDeCartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [listaDeCartas[i], listaDeCartas[j]] = [listaDeCartas[j], listaDeCartas[i]];
        }

        setListQuestions(listaDeCartas);
    }

    async function questions() {
        await api.get('/question')
            .then(response => {
                embaralhar(response.data)
            })
            .catch(erro => {
                console.error('error when making the request:' + erro);
            });
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

                            {
                                tipo === "direta" ? (
                                    <View style={styles.contentBodyResponse}>
                                        <Text style={styles.bodyResponse}>{response}</Text>
                                    </View>
                                ) : (
                                    <View style={styles.contentBodyResponse}>
                                        <Text style={styles.bodyResponse}>
                                            <Text style={styles.textV}>{responseV}</Text>{'\n'}{'\n'}
                                            <Text style={styles.textF}>{responseF}</Text>
                                        </Text>
                                    </View>
                                )
                            }
                            
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
        height: '10%',
        paddingTop: 50,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    body: {
        width: '100%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    footer: {
        width: '100%',
        height: '10%',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },

    image: {
        width: 120,
        height: 32,
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
        textAlign: 'center',
   },
    bodyCard: {
        width: '100%',
        height: '80%',
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
    textV: {
        color: '#ff0808',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
   }, 
   textF: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
   }
});

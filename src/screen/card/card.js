import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, Image, TouchableOpacity, Modal, Button, ScrollView, Linking } from 'react-native';
import { Audio } from 'expo-av';

import {useNavigation} from '@react-navigation/native';

import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import api from '../../service/index.js';

export default function Card() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [sound, setSound] = useState();

    const [indexSort, setIndexSort] = useState(-1);
    const [listQuestions, setListQuestions] = useState([]);
    const [id, setId] = useState('');
    const [arrId, setArrId] = useState([]);
    const [arrQuestion, setArrQuestion] = useState([]);
    const [theme, setTheme] = useState('');
    const [tipo, setTipo] = useState('');
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [responseV, setResponseV] = useState('');
    const [responseF, setResponseF] = useState('');
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        showShuffle('begin');

        return sound
        ? () => {
              sound.unloadAsync();
          }
        : undefined;
    }, [sound]);

    async function playAudio() {
        if (!isPlaying){
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../../service/time3.mp3')
                );
                setSound(sound);
                const status = await sound.getStatusAsync();
                await sound.playAsync();
            } catch (error) {
                console.error("Error playing sound:", error);
            }
        }
    }

    async function adjustSound() {
        setIsPlaying(!isPlaying);

        if (sound !== null) {
            if (isMuted) {
                await sound.setVolumeAsync(1);
            } else {
                await sound.setVolumeAsync(0);
            }
            
            setIsMuted(!isMuted);
        }
    };

    function closeCard(){
        Alert.alert(
            'Sair',
            'Ao sair a sessão será finalizada.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: () => navigation.navigate('Home'),
                },
            ],
            { cancelable: false }
        );
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

    function getNextNumber() {
        nextNumber = indexSort + 1;

        if (nextNumber == listQuestions.length){
            shuffle(null);
            nextNumber = 0;
        }

        setIndexSort(nextNumber);
        return nextNumber;
    }
    
    const addItem = (item, question) => {
        const newArrId = [...arrId, item];
        const newArrQuestion = [... arrQuestion, question];
        setArrId(newArrId);
        setArrQuestion(newArrQuestion);
      };

    function random() {
        index = getNextNumber();
        const res = listQuestions[index];
        addItem(res.id, res.pergunta);
        
        if (res !== undefined) {
            setId(res.id);
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
            playAudio();
        }
    }

    function showShuffle(msg = null) {
        setIndexSort(-1);
        title = msg == 'begin' ? 'Vamos iniciar?' : '';
        questions();
    }

    function shuffle(listaDeCartas){
        if (listaDeCartas == null){
            listaDeCartas = listQuestions;
        } else {
            for (let i = 0, j = 1; i < listaDeCartas.length; i++, j++) {
                listaDeCartas[i].id = j;
            }
        }

        for (let i = listaDeCartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [listaDeCartas[i], listaDeCartas[j]] = [listaDeCartas[j], listaDeCartas[i]];
        }

        setListQuestions(listaDeCartas);
    }

    const openHistory = () => {
        setModalVisible(true);
    };

    async function questions() {
        await api.get('/question')
            .then(response => {
                shuffle(response.data);

                /*Alert.alert(
                    'Embaralhadas',
                    'As cartas foram embaralhadas.',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );*/
            })
            .catch(erro => {
                console.error('error when making the request:' + erro);
            });
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
                style={styles.modal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>    
                            Histórico completo
                        </Text>

                        <ScrollView>
                            {arrId.slice().reverse().map((id, index) => (
                                <Text key={index}>
                                    {arrId.length - index} - (ID: {id}) {arrQuestion[arrQuestion.length - index - 1]}
                                </Text>
                            ))}
                        </ScrollView>

                        <Button title="Fechar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            <View>
                <View style={styles.header}>
                    <Text onPress={() => Linking.openURL('https://www.sp.senai.br/curso/tecnico-em-desenvolvimento-de-sistemas/97016')}>
                        <Image style={styles.image} source={require('../../image/logoSenai.png')} />
                    </Text>
                    
                    
                    
                    <TouchableOpacity onPress={adjustSound}>
                        <FontAwesome5 name={isPlaying ? "volume-off" : "volume-up"} size={32} color="#ff0808" />   
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openHistory}>
                        <FontAwesome5 name="history" size={32} color="#ff0808" />   
                    </TouchableOpacity>
                </View>

                {visible ? (
                    <View style={styles.body}>
                        <Animatable.View style={styles.bodyCardVisible}  animation='flipInY' >
                            <Text style={styles.bodyTitle}>Tema: {theme}</Text>
                            <Text style={styles.bodyQuestion}>{id} - {question}</Text>

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

                    <TouchableOpacity onPress={showShuffle}>
                        <FontAwesome5 name="stream" size={32} color="#ff0808" />
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

    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        height: '80%',
        width: '80%',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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

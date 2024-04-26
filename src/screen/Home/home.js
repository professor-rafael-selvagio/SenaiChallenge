import {View, Text, StyleSheet, Image, TouchableOpacity, Linking} from 'react-native'
import {useNavigation} from '@react-navigation/native';

export default function Home(){

    const navigation = useNavigation();

    function navegarCard(){
        navigation.navigate('Card')
     
    }

    return(
        <View style={styles.container}>
            <Image style={styles.image} source={require('../../image/logoSenai.png')}/>
            <Text style={styles.textName}>Challenge</Text>
            <TouchableOpacity style={styles.button} onPress={navegarCard}>
                <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.touchableOpacity}>
                    <Text style={styles.textIdea} onPress={() => Linking.openURL('https://github.com/otreborBz/GameDev')}>Idealizado por Roberto 3MDS</Text>
                    <Text style={styles.textIdea} onPress={() => Linking.openURL('https://github.com/professor-rafael-selvagio/SenaiChallenge')}>
                        Atualizado por Rafael Selvagio, Vinicius Santos e Wesley Pecoraro
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0808'
    },
    image:{
        width: '90%',
        height: '8%',
    },
    textName:{
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    },
    textIdea:{
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        margin: 5
    },
    button:{
        backgroundColor: '#fff',
        width: '50%',
        height: 40,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    },
    buttonText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff0808'
    },
    footer: {
        position: 'absolute',
        flexDirection: 'column',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    touchableOpacity: {
        flex: 1,
        margin: 5
    }
})
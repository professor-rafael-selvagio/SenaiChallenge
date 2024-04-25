import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native';

export default function Home(){

    const navigation = useNavigation();

    function navegarCard(){
        navigation.navigate('Card')
     
    }

    return(
        <View style={styles.container}>
            <Image style={styles.image} source={require('../../image/logoSenai.png')}/>
            <Text style={styles.textName}>GameDev</Text>
            <TouchableOpacity style={styles.button} onPress={navegarCard}>
                <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
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
    }
})
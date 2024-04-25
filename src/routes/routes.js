import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Card from '../screen/card/card.js';
import Home from '../screen/Home/home.js';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
        <Stack.Navigator 
        screenOptions={{
          headerShown: false
        }}>

          <Stack.Screen
          name='Home'
          component={Home}
          />

          <Stack.Screen
          name='Card'
          component={Card}
          />

        </Stack.Navigator>
      
  );
}


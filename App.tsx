import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import AddEditItemScreen from './screens/AddEditItem';
import { RootStackParamList } from './screens/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddEditItem"
          component={AddEditItemScreen}
          options={{
            title: 'Add menu item',
            headerStyle: { backgroundColor: '#f2f4f7' },
            headerTintColor: '#315d82',
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

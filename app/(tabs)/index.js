import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View } from 'react-native';

import ReportDetails from '../../src/screens/ReportDetails.js';
import WriteReport from '../../src/screens/WriteReport.js';
import Login from '../../src/screens/Login.js';
import AddMoreDetail from '../../src/screens/AddMoreDetail.js';
import HomeScreen from '../../src/screens/Home.js';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1877F2" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1877F2',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false, // Hide the header for Login screen
          }}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown : false}}/>
        <Stack.Screen name="Detail" component={ReportDetails} options={{headerShown : false}}/>
        <Stack.Screen name="Write" component={WriteReport} options={{headerShown : false}}/>
        <Stack.Screen name='Add More' component={AddMoreDetail} options={{headerShown : false}}/>
      </Stack.Navigator>
    </View>
  );
}

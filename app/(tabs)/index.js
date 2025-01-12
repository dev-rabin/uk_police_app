import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View } from 'react-native';

import Home from '../../screens/Home.js';
import ReportDetails from '../../screens/ReportDetails.js';
import WriteReport from '../../screens/WriteReport.js';
import Login from '../../screens/Login.js';
import AddMoreDetail from '../../screens/AddMoreDetail.js';

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
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Detail" component={ReportDetails} />
        <Stack.Screen name="Write" component={WriteReport} />
        <Stack.Screen name='Add More' component={AddMoreDetail}/>
      </Stack.Navigator>
    </View>
  );
}

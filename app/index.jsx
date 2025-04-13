import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chef from '../screens/chef';




const App = () => {
  return (
    <Chef/>
  );
};

registerRootComponent(App);

export default App;
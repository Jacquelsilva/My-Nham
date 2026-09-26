import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home";
import RecipeProduct from "../screens/RecipeProduct";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: "Minhas Receitas" }} 
        />
        <Stack.Screen 
          name="RecipeProduct" 
          component={RecipeProduct} 
          options={{ title: "Detalhes da Receita" }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
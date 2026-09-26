import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Recipe } from './recipe';

export type RootStackParamList = {
  Home: undefined;
  RecipeProduct: { recipe: Recipe }; 
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type RecipeProductScreenProps = NativeStackScreenProps<RootStackParamList, 'RecipeProduct'>;
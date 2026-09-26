import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Home: undefined;
    RecipeProduct: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type RecipeProductScreenProps = NativeStackScreenProps<RootStackParamList, 'RecipeProduct'>;
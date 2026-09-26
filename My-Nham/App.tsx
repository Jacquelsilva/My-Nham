import React, { useEffect } from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/database';

export default function App() {
  useEffect(() => {
    initDatabase(); 
  }, []);

  return <AppNavigator />;
}

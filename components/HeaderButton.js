import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import COLORS from '../constants/colors';

const CustomHeaderButton = props => {

  return (
    <HeaderButton 
      {...props} 
      IconComponent={Ionicons} 
      iconSize={28} 
      color={Platform.OS === 'android' ? 'white' : COLORS.primary} 
    />
  );
};

export default CustomHeaderButton;
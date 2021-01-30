import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../constants/colors';

const PlaceItem = props => {
  return (
    <TouchableOpacity onPress={props.onSelect} style={styles.placeItem}>
      <Image style={styles.image} source={{ uri: props.image }} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.address}>{props.address}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.btn} onPress={props.onEdit}>
          <Ionicons
            name="md-create"
            color={COLORS.primary}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={props.onDelete}>
          <Ionicons 
            name="md-trash"
            color="#d9534f"
            size={25}
          />
        </TouchableOpacity>      
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  placeItem: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    borderColor: COLORS.primary,
    borderWidth: 1
  },
  infoContainer: {
    marginLeft: 25,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  actionsContainer :{
    width: '12%',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  title: {
    color: 'black',
    fontSize: 18,
    marginBottom: 5
  },
  address: {
    color: '#666',
    fontSize: 16
  },
  btn: {
    flex: 1
  }
});

export default PlaceItem;

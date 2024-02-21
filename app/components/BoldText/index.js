import React from 'react';
import { Text } from 'react-native';


const BoldText = (props) => {
return (
    <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
)
}
export default BoldText ;
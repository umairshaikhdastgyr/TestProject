import * as React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import { Heading, Icon } from '#components';

import { Colors } from '#themes'

const AddressListFooter = ({
    onPress
}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={styles.container}
            >
                <Heading style={{fontFamily:'Montserrat-SemiBold'}} type="bodyText" bold>Add an address</Heading>
                <Icon icon="add" color="grey" />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: Colors.grey,
    }
})

AddressListFooter.defaultProps = {
    onPress: () => []
}

AddressListFooter.propTypes = {
    onPress: PropTypes.func.isRequired
}

export default AddressListFooter
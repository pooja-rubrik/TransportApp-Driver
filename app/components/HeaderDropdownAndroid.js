import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    HeaderButtons,
    HeaderButton,
    defaultOnOverflowMenuPress,
} from 'react-navigation-header-buttons';

const MaterialHeaderButton = props => (
    <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={25} color="white" />
)

export const HeaderMenu = props => {
    
    return ( 
        <HeaderButtons
            HeaderButtonComponent={MaterialHeaderButton}
            OverflowIcon={<MaterialIcons name="menu" size={25} color="white" />}
            onOverflowMenuPress={({ overflowButtonRef, hiddenButtons }) =>
                defaultOnOverflowMenuPress({
                    overflowButtonRef,
                    hiddenButtons,
                    cancelButtonLabel: 'cancel',
                })
            }
            {...props}
        />
    );

};

export const HeaderDriver = props => {
    
    return ( 
        <HeaderButtons
            HeaderButtonComponent={MaterialHeaderButton}
            OverflowIcon={<MaterialIcons name="person-add" size={24} color="white" />}
            {...props}
        />
    );

};

export { Item } from 'react-navigation-header-buttons';
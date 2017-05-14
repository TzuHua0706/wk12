import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/UserScreen';
import SettingScreen from './screens/SettingScreen';
import SignUp from './screens/SignUp';

export const UserStack = StackNavigator({
    UserScreen: {
        screen: UserScreen,
        navigationOptions: {
            header: ({ navigate }) => ({
                title: 'USER-INFO',
                right: (
                    <Icon
                        name='settings'
                        iconStyle={{ marginRight: 10 }}
                        onPress={() => navigate('SettingScreen')}
                    />
                ),
                left: null,
            })
        }
    },
    SettingScreen: {
        screen: SettingScreen,
        navigationOptions: {
            header: ({ navigate }) => ({
                title: 'SETTING',
                left: (
                    <Icon
                        name='navigate-before'
                        iconStyle={{ marginLeft: 10 }}
                        onPress={() => navigate('UserScreen')}
                    />
                ),
            })
        }
    },
});

export const SignUpStack = StackNavigator({
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: ({ navigate }) => ({
                left: (
                    <Icon
                        name='navigate-before'
                        iconStyle={{ marginLeft: 10 }}
                        onPress={() => navigate('LoginScreen')}
                    />
                ),
            })
        }
    },
},
);

export const LoginStack = StackNavigator({
    LoginScreen: {
        screen: LoginScreen,
    },
    SignUpStack: {
        screen: SignUpStack,
    },
    UserStack: {
        screen: UserStack,
    },
},
    {
        headerMode: 'none',
    }
);

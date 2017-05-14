import React, { Component } from 'react';
import { View, ActivityIndicator, AsyncStorage, Image } from 'react-native';
import * as firebase from 'firebase';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import { Facebook } from 'expo';

import Confirm from '../components/Confirm';

// Make a component
class LoginScreen extends Component {
  state = {
    email: null,
    password: null,
    error: ' ',
    loading: false,
    showModal: false,
    token: null,
    status: 'Not Login...'
  };

  facebookLogin = async () => {
    console.log('Testing token....');
    let token = await AsyncStorage.getItem('fb_token');

    if (token) {
      console.log('Already having a token...');
      this.setState({ token });

      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      this.setState({ status: `Hello ${(await response.json()).name}` });
      console.log(response);

    } else {
      console.log('DO NOT having a token...');
      this.doFacebookLogin();
    }
  };

  doFacebookLogin = async () => {
    let { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '113143229250709',
      {
        permissions: ['public_profile'],
        behavior: 'web'
      });

    if (type === 'cancel') {
      console.log('Login Fail!!');
      return;
    }

    await AsyncStorage.setItem('fb_token', token);
    this.setState({ token });
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`);
    this.setState({ status: `Hello ${(await response.json()).name}` });
    console.log(response);
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    try {
      await firebase.auth().signInWithCredential(credential);
      const { currentUser } = await firebase.auth();
      console.log(`currentUser = ${currentUser.uid}`);
      this.props.navigation.navigate('UserStack');
    } catch (err) {

    }
  };

  onSignIn = async () => {
    const { email, password } = this.state;
    this.setState({ error: ' ', loading: true });
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      this.props.navigation.navigate('UserStack');
    } catch (err) {
      this.setState({
        error: err.message,
      });
      //this.setState({ showModal: true });
    }
  }

  onSignUp = async () => {
    this.props.navigation.navigate('SignUpStack');
  }

  onCreateUser = async () => {
    const { email, password } = this.state;
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      this.setState({ showModal: false });
      this.props.navigation.navigate('UserStack');
    } catch (err) {
      this.setState({
        email: '',
        password: '',
        error: err.message,
        loading: false,
        showModal: false
      });
    }
  }

  onCLoseModal = () => {
    this.setState({
      email: '',
      password: '',
      error: '',
      loading: false,
      showModal: false
    });
  }

  renderButton() {
    if (this.state.loading) {
    //  return <ActivityIndicator size='large' style={{ marginTop: 30 }} />;
    }
    return (
      <Button
        title='Sign in'
        backgroundColor='#4AAF4C'
        onPress={this.onSignIn}
        buttonStyle={{ borderRadius:3, }}
      />
    );
  }
  
  async componentDidMount() {
    await AsyncStorage.removeItem('fb_token');
  }

  render() {
    return (
      <View style={styles.all}>
        <Image source = {require('./img.png')} style={{marginTop:55,}}/>
        <View style={styles.top}>
        <View style={styles.tit}>
          <FormLabel>Email</FormLabel>
          <FormInput
            placeholder=''//'user@email.com'
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='email-address'
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          </View>
          <View style={styles.tit}>
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry
            autoCorrect={false}
            autoCapitalize='none'
            placeholder=''//'password'
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          </View>
          <View style={styles.signin}>{this.renderButton()}</View>
          <FormValidationMessage style={{height:80,}}>{this.state.error}</FormValidationMessage>
        </View>
          <Button
            title='Sign in with Facebook'
            backgroundColor='#39579A'
            onPress={this.facebookLogin}
            buttonStyle={{ borderRadius:3, marginTop:-5, width:310,}}
          />
        <Button
          title='New user ?'
          backgroundColor='#ffffff'
          color='#1e90ff'
          onPress={this.onSignUp}
          buttonStyle={{ borderRadius:3, width:340,}}
        />
      </View>
    );
  }
}

const styles = {
  all: {
    backgroundColor: '#ffffff',
    height: 1334,
    alignItems:'center',
  },
  top: {
    marginTop: 0,
    width:340,
  },
  tit: {
    marginLeft:8,
  },
  signin: {
    marginTop:20,
  },
};

export default LoginScreen;
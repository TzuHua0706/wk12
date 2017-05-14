import React, { Component } from 'react';
import { View, Picker, ActivityIndicator, AsyncStorage, } from 'react-native';
import * as firebase from 'firebase';

import { FormLabel, FormInput, Button, CheckBox } from 'react-native-elements';

// Make a component
class SignUp extends Component {
  state = {
    email: null,
    password: null,
    birthday: null,
    gender: null,
    username: null,
    signup: false,
    error: ' ',
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

  onSignUp = async () => {
    //this.setState({ signup: true });
    //const { currentUser } = firebase.auth();
    const { email, password, birthday, gender, username } = this.state;
    this.setState({ error: ' ', signup: true });
    try {
      
      await firebase.auth().createUserWithEmailAndPassword( email, password );

      const { currentUser } = firebase.auth();    
      let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
      dbUserid.set({ email, password, birthday, gender, username });

      this.props.navigation.navigate('UserStack');
      this.setState({ signup: false });

    } catch (err) {
      this.setState({
        email: '',
        password: '',
        error: err.message,
        signup: false,
      });
    }
    //await dbUserid.set({ email, username, password, birthday, gender });
  }

  renderButton() {
    if (this.state.signup) {
    //  return <ActivityIndicator size='large' style={{ marginTop: 30 }} />; 
    }
    return (
      <Button
        style={{ marginTop: 20, }}
        buttonStyle={{ borderRadius:3, }}
        title='Sign up'
        onPress={this.onSignUp}
        backgroundColor='#4AAF4C'
      />
    );
  }

  //async componentWillMount() {
    //const { currentUser } = firebase.auth();
    //let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    //try {
      //let snapshot = await dbUserid.once('value');
      //let email = snapshot.val().email;
      //let password = snapshot.val().passwoed;
      //let birthday = snapshot.val().birthday;
      //let gender = snapshot.val().gender;

      //this.setState({ email, password, birthday, gender });
    //} catch (err) { }
  //}

  async componentDidMount() {
    await AsyncStorage.removeItem('fb_token');
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.formStyle}>
      <View style={{width: 340,}}>
        <FormLabel>Email</FormLabel>
        <FormInput
          placeholder=''
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='xxx@gmail.com'
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <FormLabel>Password</FormLabel>
        <FormInput
          secureTextEntry
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='password'
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <FormLabel>Username</FormLabel>
        <FormInput
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='Username'
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
        />
        <FormLabel>Birthday</FormLabel>
        <FormInput
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='2017/05/14'
          value={this.state.birthday}
          onChangeText={birthday => this.setState({ birthday })}
        />
        <FormLabel>Gender</FormLabel>
        <FormInput
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='mail'
          value={this.state.gender}
          onChangeText={gender => this.setState({ gender })}
        />
        {this.renderButton()}
        </View>
        <View style={styles.formStyle}>
          <Button
            title='Sign in with Facebook'
            backgroundColor='#39579A'
            onPress={this.facebookLogin}
            buttonStyle={{ borderRadius:3, width:310, marginTop:70, }}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  formStyle: {
    marginTop: 10,
    height: 1294,
    backgroundColor:'#ffffff',
    alignItems:'center',
  },
};

export default SignUp;

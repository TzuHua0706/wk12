import React, { Component } from 'react';
import * as firebase from 'firebase';
import { LoginStack } from './Router';

class App extends Component {

  componentWillMount() {
    firebase.initializeApp({
      //apiKey: "AIzaSyA139Gz_OWXVDN2L71AZx48CK1c015glVw",
      //authDomain: "fireauthapp-6682a.firebaseapp.com",
      //databaseURL: "https://fireauthapp-6682a.firebaseio.com",
      //projectId: "fireauthapp-6682a",
      //storageBucket: "fireauthapp-6682a.appspot.com",
      //messagingSenderId: "619517647764"
      apiKey: "AIzaSyAh2c87Q9Mm3bRwcobDAkkYNasQuntHcCI",
      authDomain: "wk12-e2fd3.firebaseapp.com",
      databaseURL: "https://wk12-e2fd3.firebaseio.com",
      projectId: "wk12-e2fd3",
      storageBucket: "wk12-e2fd3.appspot.com",
      messagingSenderId: "155526910014"
    });
  }

  render() {
    return (
      <LoginStack />
    );
  }
}


export default App;

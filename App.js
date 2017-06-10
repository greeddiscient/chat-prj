import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';

class Home extends React.Component {
  login(){
    console.log("pressed")
    axios.get(`http://localhost:7000/all_conversation/593bb2b04b67704ee4d39880`)
    .then(res => {
      object = res.data[0]
      console.log(object._id)
      Actions.convo({id:object._id})
    });

  }
  render() {
    return (
      <View style={styles.container}>
        <Text onPress={() => Actions.convo()}>Open up App.js to start working on your app!</Text>
        <Text onPress={this.login.bind(this)}>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}
class Convo extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.id}</Text>
      </View>
    );
  }
}
export default class App extends React.Component {
  render() {
    return (

        <Router>
          <Scene key="root">
            <Scene key="home"
              component={Home}
              title="Home"
              initial
            />
            <Scene
              key="convo"
              component={Convo}
              title="Convo"
            />
          </Scene>
        </Router>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#df4747',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

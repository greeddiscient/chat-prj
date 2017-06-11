import React from 'react';
import { StyleSheet, Text, View,TextInput,Button } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user_name: '',
                    password:''};
  }
  login(){


    var name= this.state.user_name
    axios.post('http://localhost:7000/users', {
      user_name: name,
      password: this.state.password
    })
    .then(response=> {
      console.log(this.state.user_name)
      Actions.users({user: name})
    })
    .catch(function (error) {

    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Username</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(user_name) => this.setState({user_name})}
            value={this.state.user_name}
          />
        <Text>Password</Text>

          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />
          <Button
            onPress={this.login.bind(this)}
            title="Login"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
      </View>
    );
  }
}
class Convo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      recipient:'',

    };
  }
  componentWillMount(){
  }
  sendMessage(){
    axios.post('http://localhost:7000/users', {
      user_name: name,
      password: this.state.password
    })
    .then(response=> {
      console.log(this.state.user_name)
      Actions.users({user: name})
    })
    .catch(function (error) {

    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Logged in as {this.props.user}</Text>
        <Text>Recipient: {this.props.recipient}</Text>
        {users.map(user=>
          <Text key={user}>{user}</Text>)}
        <Text>Recipient</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(recipient) => this.setState({recipient})}
            value={this.state.recipient}
          />
        <Text>Message</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(message) => this.setState({message})}
            value={this.state.message}
          />
          <Button
            onPress={this.sendMessage.bind(this)}
            title="Send"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
      </View>
    );
  }
}
class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      recipient:'',
      users:[]
    };
  }
  componentWillMount(){
    axios.get(`http://localhost:7000/all_users`)
    .then(res => {
      var arr=res.data
      // for (user in res.data){
      //   console.log(user)
      //   this.state.users.push(user)
      //
      // }
      var temp_users=[]
      for (var i=0;i<res.data.length-1;i++){
        console.log(arr[i])
        temp_users.push(arr[i].user_name)
      }
      this.setState({users:temp_users})
    });
  }
  render() {
    var users=this.state.users
    return (
      <View style={styles.container}>
        <Text>Logged in as {this.props.user}</Text>
        <Text>Available Users</Text>
        {users.map(user=>
          <Text key={user}>{user}</Text>)}
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
            <Scene
              key="users"
              component={Users}
              title="Users"
            />
          </Scene>
        </Router>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

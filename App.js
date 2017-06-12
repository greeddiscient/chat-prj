import React from 'react';
import { StyleSheet, Text, View,TextInput,Button,Alert } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user_name: '',
                    password:'',
                  my_user:''};
  }

  login(){
    var name= this.state.user_name
    axios.post('http://localhost:7000/users', {
      user_name: name,
      password: this.state.password
    })
    .then(response=> {
      console.log(response.data)
      if('error' in response.data){
        console.log("NAME TAKEN")
        Alert.alert(
          'Name Taken',
          'Choose Another Name',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')}
          ],
          { cancelable: false }
        )
      }
      else{
        this.setState({my_user: response.data})
        Actions.users({my_user: response.data})
      }

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
      convoid:'',
      messages:[]
    };
  }

  componentWillMount(){
    axios.get(`http://localhost:7000/conversation/`+this.props.my_user._id+'&'+this.props.recipient._id)
    .then(response => {
      if('error' in response.data){
        console.log("no convo creating new")
        axios.post('http://localhost:7000/new_conversation/', {
          users:[
            this.props.my_user._id,
            this.props.recipient._id
          ],
          messages:[

          ]
        })
        .then(response=> {
          console.log(response.data._id)
          console.log("finished posting")
          this.setState({convoid: response.data._id})
        })
        .catch(function (error) {
          console.log(error)
        });
      }
      else{
        this.setState({convoid: response.data._id})
        this.setState({messages: response.data.messages})
        console.log(this.state.convoid)
      }
    });
  }

  sendMessage(){
    var messageStore=this.state.messages
    var d= new Date();
    var jsonbody={
      fromid: this.props.my_user._id,
      message_content: this.state.message,
      time_stamp: d.toLocaleString()
    }
    axios.post('http://localhost:7000/new_message/'+this.state.convoid, jsonbody)
    .then(response=> {
      messageStore.push(jsonbody)
      this.setState({messages: messageStore})
    })
    .catch(function (error) {

    });
  }
  render() {
    var messages = this.state.messages
    return (
      <View style={styles.container}>
        <Text>Logged in as {this.props.my_user.user_name}</Text>
        <Text>Sending message to {this.props.recipient.user_name}</Text>
        <Text>Convo ID {this.state.convoid}</Text>
        <Text>Messages:</Text>
          {messages.map(message=>
            <Text key={message.time_stamp}>{message.fromid} said: {message.message_content} </Text>)}
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
      users:[],
      updated: false
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
        temp_users.push(arr[i])
      }
      this.setState({users:temp_users})
      this.setState({updated: true})
    });
  }
  render() {
    var users=this.state.users
    var updated=this.state.updated
    if(!updated){
      return(
        <View style={styles.container}>
          <Text>Logged in as {this.props.my_user.user_name}</Text>
          <Text>No Users Available to Chat</Text>
        </View>
      );
    }
    else{
      return (
        <View style={styles.container}>
          <Text>Logged in as {this.props.my_user.user_name}</Text>
          <Text>Available Users</Text>
          {users.map(user=>
            <Text onPress={()=>Actions.convo({recipient: user,my_user: this.props.my_user})} key={user.user_name}>{user.user_name} {user._id}</Text>)}
        </View>
      );
    }
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

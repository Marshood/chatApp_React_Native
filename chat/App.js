import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorageStatic, AsyncStorage } from 'react-native';
import SocketIOClient from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat';

const USER_ID = '@userid';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: [],
      userID: null
    }

    this.determineUser = this.determineUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessage = this._storeMessage.bind(this);

    this.socket = SocketIOClient('http://localhost:3000');
    this.socket.on('message', this.onReceivedMessage);
    this.determineUser();
  };

  determineUser() {
    AsyncStorage.getItem(USER_ID)
      .then((userID) => {
        if (!userID) {
          this.socket.emit('userJoined', null);
          this.socket.on('userJoined', (userID) => {
            AsyncStorage.setItem(USER_ID, userID);
            this.setState({ userID })
          })
        }
        else {
          this.socket.emit('userJoined', userID);
          this.setState({ userID });
        }
      })
      .catch((e) => alert(e));

  }

  onReceivedMessage(messages) {
    this._storeMessage(messages);
  }

  onSend(messages = []) {
    this.socket.emit('message', messages[0]);
    this._storeMessage(messages);
  }

  render() {
    var user = { _id: this.state.userID || -1 };

    return (
      <GiftedChat
        message={this.state}
        onSend={this.onSend}
        user={user}
      />
    )

    _storeMessage(messages)
    {
      this.setState((previosState)=>{
        return{
          messages: GiftedChat.append(previosState.messages,messages)
            }      })
    }
  }


}
module.exports=Main;



// export default function App() {
//   return (

//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

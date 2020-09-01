## Node js Chat Stream  
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://www.npmjs.com/package/@cooperative-computing/node-chat-stream" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/cooperative-computing/node-chat-stream/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

A NodeJS chat library build with socket.io and express js.This Package provide following types of chat:  

1-User to user chat  

2-User to multi-user chat 

3-Group chat 

## Getting Started

### Prerequisites  
1-Nodejs  
2-Express server  
2-MongoDB  
3-Socket Io version >= v2.3.0  
4-Api Required to fetch user info


API url `https://your_app.com/getUsersByIds?ids[]=1&ids[]=2`  
API response: 
```sh
{
  users:[
    {
      id:1,
      .....
    }
  ]
}
```  


### Installation  
1-Run 
```sh
npm i @cooperative-computing/node-chat-stream
//or
yarn add @cooperative-computing/node-chat-stream
```  
2- Server side import and config:  
```sh
import { SetChatConfig, StartChat } from ('@cooperative-computing/node-chat-stream');
//(above for es6 ) or
const { SetChatConfig, StartChat } = require('@cooperative-computing/node-chat-stream').NodeChatSteam;

ChatConfig({db_url: 'your_db_url'});  

StartChat(your_project_socket , express_server);
``` 
 

### Client Side Flow  
1-Install socket io  
2-import and socket io config  
3-Adde following event listener (also other basic event listener like reconnect ,disconnect)  


```sh
socket.on("user-message", your_method/function);         
//  for user to user chat
```  

```sh
socket.on("multi-user-message", your_method/function);
//  user to multi-user chat
```  

```sh
socket.on("group-message", your_method/function);
//  group chat  
```  


4- 
```sh
socket.emit("node-chat-join", {user_id: 'user_id'});
```  

### For sending messages example  
```sh
socket.on("user-message", {text: 'text',sender: 'sender_id',receiver: 'receiver_id', chat_list_id: 'chat_list_id'});
// chat_list_id is optional in user to user

//  for user to user  
```  
```sh
socket.on("multi-user-message", {text: 'text',chat_list_id: 'chat_list_id'});
//  for user to multi-user 
```  
```sh
socket.on("group-message", {text: 'text',sender: 'sender_id',chat_list_id: 'chat_list_id'});
//  for group  chat 
```  


### REST API Docmentation  
> https://documenter.getpostman.com/view/12181559/T1DqhdBV?version=latest  

## Built With

* [Socket.IO](https://socket.io/) - Realtime communication library
* [Express](https://expressjs.com/) - Web application framework for Node.js.
* [MongoDB](https://www.mongodb.com/) - NoSQL database

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/cooperative-computing/node-chat-stream/issues). 


## Show your support

Give a ⭐️ if this project helped you!  

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
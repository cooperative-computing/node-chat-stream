import SocketIOFileUpload from 'socketio-file-upload';
//Models
import ChatList from './Models/ChatList';


import Helper from './Helper';




const Socket_IO = (socket) => {
  var clients: any[] = [];
  //setup event listener
  socket.on("connection", async client => {
    console.log("- connected  to socket -");

    var uploader = new SocketIOFileUpload();
    uploader.dir = "./uploads";
    uploader.listen(client);

    // Do something when a file is saved:
    uploader.on("saved", function (event) {
      console.log("saved ", event.file);
    });

    // Error handler:
    uploader.on("error", function (event) {
      console.log("Error from uploader", event);
    });

    client.on("node-chat-join", async e => {
      let user_id = await Helper.getUserId(e);
      if (!user_id) return false;
      client.user_id = user_id;
      if (clients[user_id]) {
        clients[user_id].push(client);
      } else {
        clients[user_id] = [client];
      }
      console.log("node-chat-join complete");
    });

    client.on("disconnect", function () {
      if (!client.user_id || !clients[client.user_id]) return false;
      let targetClients = clients[client.user_id];
      for (let i = 0; i < targetClients.length; ++i) {
        if (targetClients[i] == client) {
          targetClients.splice(i, 1);
        }
      }
    });

    // user to user start
    client.on("message", async event => {
      console.log("message ", event);
      if (event.sender_id && event.receiver_id) {
        event.sender = await Helper.userIdToMongoId(event.sender_id);
        event.receiver = await Helper.userIdToMongoId(event.receiver_id);
      }
      let targetId = event.receiver;
      if (targetId && clients[targetId]) {
        clients[targetId].forEach(cli => {
          cli.emit("message", event);
        });
      }
      await Helper.userToUserChat(event);
    });
    // user to user end


    // user to multi user start
    client.on("multi-user-message", async event => {
      let room = await ChatList.findOne({ _id: event.chat_list_id });
      if (room._id) {
        Helper.sendMultiUserMsg(room, clients, event);
        Helper.addChat(event); //save chat to the database
      }
    });
    // user to multi user end


    client.on("group-message", async (data) => {
      let room = await ChatList.findOne({ _id: data.chat_list_id });
      if (room._id) {
        Helper.sendMultiUserMsg(room, clients, data);
        Helper.addChat(data); //save chat to the database
      }
    });




  });





}


export default Socket_IO;
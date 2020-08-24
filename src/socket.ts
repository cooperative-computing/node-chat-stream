//Models
import ChatList from './Models/ChatList';


import Helper from './Helper';




const Socket_IO = (socket) => {
  var clients: any[] = [];
  //setup event listener
  socket.on("connection", async client => {
    console.log("- connected  to socket -");

    client.on("node-chat-join", async e => {
      let user_id = await Helper.getUserId(e);
      console.log(" node-chat-join call ", user_id);

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
    client.on("user-message", async event => {
      console.log("user-message ", event);
      let ids = [event.receiver];
      if (event.includeSender) ids.push(event.sender);
      ids.forEach((id: any) => {
        clients[id].forEach(cli => {
          cli.emit("user-message", event);
        });
      });
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
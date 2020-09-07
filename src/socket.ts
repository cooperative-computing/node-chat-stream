//Models
import ChatList from './Models/ChatList';
import Helper from './Helper';

const Socket_IO = (socket) => {
  var clients: any[] = [];
  var roomData: any[] = [];
  //setup event listener
  socket.on("connection", async client => {

    client.on("node-chat-join", async e => {
      let user_id = await Helper.getUserId(e);

      if (!user_id) return false;
      client.user_id = user_id;
      if (clients[user_id]) {
        clients[user_id].push(client);
      } else {
        clients[user_id] = [client];
      }
    });

    client.on("disconnect", function () {
      if (!client.user_id || !clients[client.user_id]) return false;
      let targetClients = clients[client.user_id];
      for (let i = 0; i < targetClients.length; ++i) {
        if (targetClients[i] == client) {
          targetClients.splice(i, 1);
        }
      }
      // loop through every room(chat list)
      for (let i in roomData) {
        // check if room(chat_list_id) is not defined and not empty
        if (roomData[i] !== undefined && roomData[i].length > 0) {
          // retrieve the index against disconnecting userId in roomData(Object) roomId(Array)
          const ridx = roomData[i].indexOf(client.user_id);
          if (ridx > -1) {
            // remove index/instance from roomData(Object) roomId(Array)
            roomData[i].splice(ridx, 1);
          }
        }
      }
    });

    // catch on user joins the chat room
    client.on("join_room", async room => {
      client.join('user-to-user-chat-room');
      // check if roomId(chat_list_id) exists in roomData(Object)
      if (room.roomId in roomData) {
        // check if userId exists in roomData(Object) in roomId(Array)
        if (roomData[room.roomId].indexOf(room.userId) < 0) {
          // add userId in roomId(Array)
          roomData[room.roomId].push(room.userId);
        }
      } else {
        // check if roomId(chat_list_id) is defined and empty
        if (roomData[room.roomId] === undefined || roomData[room.roomId].length == 0) {
          // create empty Array against new room(chat_list_id)
          roomData[room.roomId] = [];
          // add userId in roomId(Array)
          roomData[room.roomId].push(room.userId);
        } else {
          // check if userId exists in roomData(Object) in roomId(Array)
          if (roomData[room.roomId].indexOf(room.userId) < 0) {
            // add userId in roomId(Array)
            roomData[room.roomId].push(room.userId);
          }
        }
      }
    });

    // catch on user leaves the chat room
    client.on("leave_room", async room => {
      client.leave('user-to-user-chat-room');
      // check if roomId(chat_list_id) exists in roomData(Object)
      if (room.roomId in roomData) {
        // check if roomId has sender/receiver(user ids[Array])
        if (roomData[room.roomId].length > 0) {
          // retrieve the index against userId in roomData(Object) roomId(Array)
          const idx = roomData[room.roomId].indexOf(room.userId);
          if (idx > -1) {
            // remove index/instance from roomData(Object) roomId(Array)
            roomData[room.roomId].splice(idx, 1);
          }
        }
      }
    });

    // user to user start
    client.on("user-message", async event => {
      let ids = [event.receiver];
      if (event.include_sender) ids.push(event.sender);
      // check room exists against chat list id
      if (event.chat_list_id in roomData) {
        // check if user on other side is not active or joined chat room against chat list id
        if (roomData[event.chat_list_id].indexOf(event.receiver) < 0) {
          // send chat notification event on client side
          client.emit('send-chat-notification', true);
        }
      }
      ids.forEach((id: any) => {
        if (clients[id] && clients[id].length > 0) {
          clients[id].forEach(cli => {
            cli.emit("user-message", event);
          });
        }
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

    // user to group start
    client.on("group-message", async (data) => {
      let room = await ChatList.findOne({ _id: data.chat_list_id });
      if (room._id) {
        Helper.sendMultiUserMsg(room, clients, data);
        Helper.addChat(data); //save chat to the database
      }
      client.emit('send-group-message', data);
    });
    // user to group end


  });

}

export default Socket_IO;
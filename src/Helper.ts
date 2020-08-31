import Chat from './Models/Chat';
import ChatList from './Models/ChatList';
import fetch from 'node-fetch';

const Helper = {
  sendResponse: (res: any, data: any) => {
    res.statusCode = 200;
    res.json({ data: data, status: 'success' });
  },
  sendNotFoundResponse: (res: any, name: any) => {
    res.statusCode = 200;
    res.json({ data: [], error: 'Not found any ' + name + '!' });
  },
  errorResponse: (res: any, msg: string) => {
    res.statusCode = 400;
    res.json({ status: 'failed', error: msg });
  },
  messageResponse: (res: any, message: string) => {
    res.statusCode = 200;
    res.json({ status: 'success', message });
  },
  addChat: (chat: any) => {
    let chatMessage = new Chat({ text: chat.text, sender: String(chat.sender), chat_list_id: chat.chat_list_id });
    chatMessage.save();
  },
  sendPaginationResponse: (res: any, records: any, params = {}) => {
    res.statusCode = 200;
    let response = {
      ...params,
      data: records.docs,
      totalDocs: records.totalDocs,
      limit: records.limit,
      page: records.page,
      totalPages: records.totalPages,
      pagingCounter: records.pagingCounter,
      hasPrevPage: records.hasPrevPage,
      hasNextPage: records.hasNextPage,
      prevPage: records.prevPage,
      nextPage: records.nextPage
    }
    res.json(response);
  },
  sendMultiUserMsg: (room: any, clients: any, event: any) => {
    let allIds = room.receivers;
    let isGroup = room.chat_type == 'user-group';
    let channelName = isGroup ? 'group-message' : 'multi-user-message';
    if (!event.include_sender) allIds.splice(allIds.indexOf(event.sender), 1);// removed sender
    allIds.forEach((item: any) => {
      if (item && clients[item]) {
        clients[item].forEach((cli: any) => cli.emit(channelName, event));
      }
    });
    // send to msg to guest user who can only view chat 
    if (isGroup && clients['chat_guest_user']) {
      clients['chat_guest_user'].forEach((cli: any) => cli.emit(channelName, event));
    }
  },
  userToUserChat: async (event: any) => {
    let sender = event.sender;
    let receiver = event.receiver;
    if (sender && receiver) {
      let chat_list = event.chat_list_id;
      if (!chat_list) {
        let query = { chat_type: 'user-user', created_by: sender, receivers: [receiver, sender] };
        chat_list = new ChatList(query);
        chat_list.save();
        event.chat_list_id = chat_list._id;
      }
      Helper.addChat(event);
    }

  },
  userToUserQuery: (sender, receiver) => {
    sender = String(sender);
    receiver = String(receiver);
    return { $or: [{ chat_type: 'user-user', created_by: sender, receivers: [receiver] }, { chat_type: 'user-user', created_by: receiver, receivers: [sender] }] }
  },
  userToUserChatListQuery: (sender, receiver) => {
    sender = String(sender);
    receiver = String(receiver);
    return { $or: [{ chat_type: 'user-user', created_by: sender, receivers: [receiver, sender] }, { chat_type: 'user-user', created_by: receiver, receivers: [sender, receiver] }] }
  },
  getUserId: async (user) => {
    if (user.user_id) return user.user_id;
    return '';
  },
  addLastChatInList(list: Array<any>): Promise<any> {
    return Promise.all(
      list.map(async (item, index) => {
        const chat = await Chat.findOne({ chat_list_id: item._id }, { text: 1, sender: 1 }).sort({ createdAt: -1 });
        item.chat = chat;
        return item;
      })
    );

  },
  getUserDetails: async (url, ids) => {
    url = url + '?'
    ids.map((id) => url += 'ids[]=' + parseInt(id) + '&')
    let users: any = [];
    const headers = {
      "Content-Type": "application/json",
    }
    let getUsers = await fetch(url, { method: 'get', headers });
    getUsers = await getUsers.json();
    if (getUsers.users) users = getUsers.users;
    return users;
  },

  addUserInfoInChatList: async (url, records) => {
    let ids: Array<String> = [];
    let users: Array<any> = [];
    if (url && records.length > 0) {
      records.forEach((chatList) => {
        chatList.receivers.forEach((id) => ids.push(id));
      });
      url = url + '?'
      ids.forEach((id) => url += 'ids[]=' + id + '&')
      const headers = {
        "Content-Type": "application/json",
      }
      let getUsers = await fetch(url, { method: 'get', headers });
      getUsers = await getUsers.json();
      if (getUsers.users) return getUsers.users;
    }
    return users;
  },
  chatAddUsers: (data: any = [], users: any = []) => {
    for (let chatIndex = 0; chatIndex < data.length; chatIndex++) {
      for (let usersIndex = 0; usersIndex < users.length; usersIndex++) {
        if (data[chatIndex].sender == users[usersIndex].id) {
          data[chatIndex].user = users[usersIndex];
        }
      }
    }
    return data;
  }

};

export default Helper;
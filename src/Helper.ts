import Chat from './Models/Chat';
import Users from './Models/Users';
import ChatList from './Models/ChatList';

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
    allIds.splice(allIds.indexOf(event.sender), 1);// removed sender
    allIds.forEach((item: any) => {
      if (item && clients[item]) {
        let channelName = room.chat_type == 'user-group' ? 'group-message' : 'multi-user-message'
        clients[item].forEach((cli: any) => cli.emit(channelName, event));
      }
    });
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
    return { $or: [{ chat_type: 'user-user', created_by: String(sender), receivers: [String(receiver)] }, { chat_type: 'user-user', created_by: String(receiver), receivers: [String(sender)] }] }
  },
  getUserId: async (user) => {
    console.log("user ", user);

    if (user._id) return user._id;
    return '';
  },
  userIdToMongoId: async (user_id) => {
    let getUser = await Users.findOne({ user_id: user_id });
    return getUser._id;
  }
};

export default Helper;
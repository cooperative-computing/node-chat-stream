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
    let chatMessage = new Chat({ text: chat.text, sender: chat.sender, chat_list_id: chat.chat_list_id });
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
    let query = {}
    if (sender && receiver) {
      query = Helper.userToUserQuery(sender, receiver)
      let chat_list = await ChatList.findOne(query);
      if (!chat_list) {
        let data = { chat_type: 'user-user', created_by: sender, receivers: [receiver] };
        chat_list = new ChatList(data);
        chat_list.save();
      }
      event.chat_list_id = chat_list._id;
      Helper.addChat(event);
    }

  },
  userToUserQuery: (sender, receiver) => {
    return { $or: [{ chat_type: 'user-user', created_by: sender, receivers: [receiver] }, { chat_type: 'user-user', created_by: receiver, receivers: [sender] }] }
  },
  getUserId: async (user) => {
    console.log("user ", user);

    if (user._id) return user._id;//mongo _id in user
    if (user.user_id) return String(user.user_id);//mongo user_id in user
    if (user.email) {
      let getUser = await Users.findOne({ email: user.email });
      console.log("getUser ", getUser);
      if (getUser._id) return getUser._id;
    }
    return '';
  },
  userIdToMongoId: async (user_id) => {
    let getUser = await Users.findOne({ user_id: user_id });
    return getUser._id;
  }
};

export default Helper;
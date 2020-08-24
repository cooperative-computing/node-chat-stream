import express from 'express';
import ChatList from '../Models/ChatList';
import Chat from '../Models/Chat';
import Helper from '../Helper';

const ChatRoutes = express.Router();

//Fetch Chat for user to multi-user and user to group
ChatRoutes.route("/").get(async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 20;
  let query = {};
  let param = req.query;
  let chat_list_id = param.chat_list_id;
  let chat_type = param.chat_type;
  let created_by = param.created_by;
  let name = param.name;
  let userDetailsUrl = param.userDetailsUrl;
  if (chat_list_id && userDetailsUrl) {
    query = { chat_list_id };
    let get_chatList = await ChatList.findOne({ _id: chat_list_id });
    console.log("get_chatList ", get_chatList);
    let paginationData = await Chat.paginate(query, { page, limit, sort: { createdAt: -1 }, lean: true });
    let getUserDetails = await Helper.getUserDetails(userDetailsUrl, get_chatList.receivers);
    paginationData.docs = Helper.chatAddUsers(paginationData.docs, getUserDetails);
    Helper.sendPaginationResponse(res, paginationData);
  }
  else if (chat_type && created_by) {
    //fetch chat for group/chatlist if chat_list_id not found
    let query: any = { chat_type, created_by };
    if (name) query.name = name;
    let get_chatList = await ChatList.findOne(query);
    chat_list_id = get_chatList ? get_chatList._id : false;
    if (chat_list_id && userDetailsUrl) {
      let getUserDetails = await Helper.getUserDetails(userDetailsUrl, get_chatList.receivers);
      let paginationData = await Chat.paginate({ chat_list_id }, { page, limit, sort: { createdAt: -1 }, lean: true });
      paginationData.docs = Helper.chatAddUsers(paginationData.docs, getUserDetails);
      return Helper.sendPaginationResponse(res, paginationData, { chat_list_id });
    }
    Helper.sendNotFoundResponse(res, 'Group/chatlist not found.');

  }
  else Helper.sendNotFoundResponse(res, 'message');
});

export default ChatRoutes;
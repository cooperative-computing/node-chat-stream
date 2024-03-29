import express from "express";
import ChatList from "../Models/ChatList";
import ChatHistory from "../Models/ChatHistory";
import Chat from "../Models/Chat";
import Helper from "../Helper";

const ChatListRoutes = express.Router();

ChatListRoutes.route("/").get(async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 20;
  let query = {};
  let param = req.query;
  let user_id = param.user_id;
  let users_info_Url = param.users_info_Url;
  if (user_id && param.chat_type) {
    user_id = String(user_id);
    try {
      let chat_type = param.chat_type;
      query = { chat_type, receivers: { $all: [user_id] } };
      let paginationData = await ChatList.paginate(query, {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true,
      });
      let chatInfo: any = { chat_type, user_id: param.user_id, users: [] };
      //add last msg/chat in chatlist
      paginationData.docs = await Helper.addLastChatInList(paginationData.docs);
      chatInfo.users = await Helper.addUserInfoInChatList(
        users_info_Url,
        paginationData.docs
      );
      Helper.sendPaginationResponse(res, paginationData, chatInfo);
    } catch (error) {
      Helper.sendNotFoundResponse(
        res,
        param.chat_type == "user-group" ? "Group" : "Chat list"
      );
    }
  } else
    Helper.sendNotFoundResponse(
      res,
      param.chat_type == "user-group" ? "Group" : "Chat list"
    );
});

//Fetch Chat for user to multi-user and user to group
ChatListRoutes.route("/chat").get(async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 20;
  let query = {};
  let param = req.query;
  if (param.chat_list_id) {
    query = { chat_list_id: param.chat_list_id };
    let paginationData = await Chat.paginate(query, {
      page,
      limit,
      sort: { createdAt: -1 },
    });
    Helper.sendPaginationResponse(res, paginationData);
  } else Helper.sendNotFoundResponse(res, "message");
});

//Fetch Chat for user to user
ChatListRoutes.route("/user-user-chat").get(async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 20;
  let query = {};
  let param = req.query;
  let sender = param.sender;
  let receiver = param.receiver;
  if (sender && receiver) {
    try {
      query = Helper.userToUserQuery(sender, receiver);
      let chat_list = await ChatList.findOne(query);
      let paginationData = await Chat.paginate(
        { chat_list_id: chat_list._id },
        { page, limit, sort: { createdAt: -1 } }
      );
      Helper.sendPaginationResponse(res, paginationData, { sender, receiver });
    } catch (error) {
      Helper.sendNotFoundResponse(res, "message");
    }
  } else Helper.sendNotFoundResponse(res, "message");
});

//Add Chat
ChatListRoutes.route("/chat").post(async (req, res, next) => {
  let body = req.body;
  let sender = body.sender;
  let chat_list_id = body.chat_list_id;
  let text = body.text;
  if (sender && chat_list_id && text) {
    try {
      let chatList = await new Chat({ sender, chat_list_id, text });
      await chatList.save();
      Helper.sendResponse(res, chatList);
    } catch (e) {
      Helper.errorResponse(res, "Something went wrong.Please try again.");
    }
  }
});

//Add ChatList/Group
ChatListRoutes.route("/add").post(async (req, res, next) => {
  let body = req.body;
  let receivers = body.receivers || [];
  if (body.created_by && body.receivers && body.chat_type) {
    let allIds = [...receivers, body.created_by];
    let data = {
      chat_type: body.chat_type,
      created_by: body.created_by,
      receivers: allIds,
      name: "",
      image: "",
    };
    if (body.chat_type == "user-group") {
      data.name = body.name;
      data.image = body.image;
    }
    try {
      let chatList;

      if (body.chat_type == "user-user") {
        // Not add duplicate chat for user-user
        let query = Helper.userToUserChatListQuery(
          body.created_by,
          body.receivers[0]
        );
        let get_chatList = await ChatList.findOne(query);
        if (!get_chatList) {
          chatList = await new ChatList(data);
          await chatList.save();
        } else {
          chatList = get_chatList;
        }
      } else {
        chatList = new ChatList(data);
        chatList.save();
      }
      let getData = await ChatList.find({ _id: chatList._id });
      Helper.sendResponse(res, getData);
    } catch (e) {
      Helper.errorResponse(res, "Something went wrong.Please try again.");
    }
  } else Helper.errorResponse(res, "created_by or chat_type is missing/");
});

//Update receivers in ChatList/Group
ChatListRoutes.route("/update").post(async (req, res, next) => {
  let chat_list_id = req.body.chat_list_id;
  let receivers = req.body.receivers;
  if (chat_list_id && receivers) {
    try {
      await ChatList.findByIdAndUpdate(
        { _id: chat_list_id },
        { receivers: receivers }
      );
      Helper.messageResponse(res, "Receivers Updated successfully!");
    } catch (e) {
      Helper.errorResponse(res, "Something went wrong.Please try again.");
    }
  } else Helper.errorResponse(res, "Something went wrong.Please try again.");
});

//Remove ChatList/Group
ChatListRoutes.route("/remove").post(async (req, res, next) => {
  let ids = req.body.ids;
  if (ids && ids.length > 0) {
    try {
      let query = { _id: ids };
      await ChatList.deleteMany(query);
      await Chat.deleteMany({ chat_list_id: { $in: ids } });
      Helper.messageResponse(res, "Removed successfully!");
    } catch (e) {
      Helper.errorResponse(res, "Something went wrong.Please try again.");
    }
  } else Helper.errorResponse(res, "ids missing.");
});

ChatListRoutes.route("/delete").delete(async (req, res, next) => {
  const chatList = req.body.chatList;
  if (chatList.length > 0) {
    for (let i in chatList) {
      let { chat_list_id, userId } = chatList[i];
      try {
        await ChatHistory.updateOne(
          { chat_list_id, userId },
          { $set: { chat_list_id, userId } },
          { upsert: true }
        );
      } catch (e) {
        Helper.errorResponse(res, "Something went wrong.Please try again.");
      }
    }
    Helper.messageResponse(res, "Deleted successfully!");
  } else Helper.errorResponse(res, "ids missing.");
});

//Fetch Chat for user to multi-user and user to group
ChatListRoutes.route("/get_details").get(async (req, res, next) => {
  let chat_type = req.query.chat_type;
  let created_by = req.query.created_by;
  let group_name = req.query.group_name;
  let query: any = {};
  if (chat_type && created_by) {
    created_by = String(created_by);
    query = { created_by, chat_type };
    if (group_name) query.name = group_name;
    let chat_list_details = await ChatList.findOne(query);
    console.log("get_details ", chat_list_details);
    Helper.sendResponse(res, chat_list_details);
  } else Helper.sendNotFoundResponse(res, "created_by or chat_type missing.");
});

export default ChatListRoutes;

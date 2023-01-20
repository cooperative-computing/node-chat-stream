"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeChatSteam = void 0;
var DB_1 = __importDefault(require("./Config/DB"));
//Routes
var ChatList_1 = __importDefault(require("./routes/ChatList"));
var Chat_1 = __importDefault(require("./routes/Chat"));
var socket_1 = __importDefault(require("./socket"));
var index_1 = __importDefault(require("./Config/index"));
var SetChatConfig = index_1.default.SetChatConfig;
var NodeChatCtream = function (socket, app) {
    if (index_1.default.ChatConfig.db_url) {
        (0, DB_1.default)(index_1.default.ChatConfig.db_url).then(function (db) { return console.log("node-chat-stream DB connected to the server"); });
    }
    else
        throw new Error("Databse URL not found.");
    //routes
    app.use("/chat-stream/chatList", ChatList_1.default);
    app.use("/chat-stream/chat", Chat_1.default);
    (0, socket_1.default)(socket);
};
exports.NodeChatSteam = {
    SetChatConfig: SetChatConfig,
    StartChat: NodeChatCtream
};

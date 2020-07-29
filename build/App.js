"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeChatSteam = void 0;
var DB_1 = __importDefault(require("./Config/DB"));
var socketio_file_upload_1 = __importDefault(require("socketio-file-upload"));
//Routes
var UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
var ChatList_1 = __importDefault(require("./routes/ChatList"));
var Upload_1 = __importDefault(require("./routes/Upload"));
var socket_1 = __importDefault(require("./socket"));
var index_1 = __importDefault(require("./Config/index"));
var SetChatConfig = index_1.default.SetChatConfig;
var NodeChatCtream = function (socket, app) {
    if (index_1.default.ChatConfig.db_url) {
        DB_1.default(index_1.default.ChatConfig.db_url).then(function (db) { return console.log("Chat library DB connected correctly to the server"); });
    }
    else
        throw new Error("Databse URL not found.");
    //routes
    app.use("/chat-stream/users", UserRoutes_1.default);
    app.use("/chat-stream/chatList", ChatList_1.default);
    app.use("/chat-stream/upload", Upload_1.default);
    app.use(socketio_file_upload_1.default.router);
    socket_1.default(socket);
};
exports.NodeChatSteam = {
    SetChatConfig: SetChatConfig,
    StartChat: NodeChatCtream
};

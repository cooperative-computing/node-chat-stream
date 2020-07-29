import Connect from './Config/DB';
import SocketIOFileUpload from 'socketio-file-upload';
//Routes
import UserRoutes from './routes/UserRoutes';
import ChatListRoutes from './routes/ChatList';
import UploadRoutes from './routes/Upload';

import Socket_IO from './socket';
import Config from './Config/index';

const SetChatConfig = Config.SetChatConfig;
const NodeChatCtream = (socket, app) => {
  if (Config.ChatConfig.db_url) {
    Connect(Config.ChatConfig.db_url).then((db) => console.log("Chat library DB connected correctly to the server"));
  }
  else throw new Error("Databse URL not found.");

  //routes
  app.use("/chat-stream/users", UserRoutes);
  app.use("/chat-stream/chatList", ChatListRoutes);
  app.use("/chat-stream/upload", UploadRoutes);
  app.use(SocketIOFileUpload.router)

  Socket_IO(socket);
}


export const NodeChatSteam = {
  SetChatConfig,
  StartChat: NodeChatCtream
} 
import Connect from './Config/DB';
//Routes
import UserRoutes from './routes/UserRoutes';
import ChatListRoutes from './routes/ChatList';
import UploadRoutes from './routes/Upload';
import ChatRoutes from './routes/Chat';

import Socket_IO from './socket';
import Config from './Config/index';

const SetChatConfig = Config.SetChatConfig;
const NodeChatCtream = (socket, app) => {
  if (Config.ChatConfig.db_url) {
    Connect(Config.ChatConfig.db_url).then((db) => console.log("node-chat-stream DB connected to the server"));
  }
  else throw new Error("Databse URL not found.");

  //routes
  app.use("/chat-stream/users", UserRoutes);
  app.use("/chat-stream/chatList", ChatListRoutes);
  app.use("/chat-stream/upload", UploadRoutes);
  app.use("/chat-stream/chat", ChatRoutes);

  Socket_IO(socket);
}


export const NodeChatSteam = {
  SetChatConfig,
  StartChat: NodeChatCtream
} 
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;
const ChatHistorySchema = new Schema(
  {
    chat_list_id: {
      type: Schema.Types.ObjectId,
      ref: "chat_stream_chat_list",
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ChatHistorySchema.plugin(paginate);

let ChatHistory = mongoose.model("chat_stream_chat_history", ChatHistorySchema);
export default ChatHistory;

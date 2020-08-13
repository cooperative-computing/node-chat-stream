import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const ChatListSchema = new Schema(
  {
    chat_type: {
      type: String,
      enum: ['user-user', 'user-multi-user', 'user-group'],
      default: 'user-multi-user'
    },
    receivers: [{
      type: String
    }],
    created_by: {
      type: String
    },
    name: {
      type: String
    },
    image: {
      type: String
    },
  },
  {
    timestamps: true
  }
);

ChatListSchema.plugin(paginate);
let ChatList = mongoose.model('chat_stream_chat_list', ChatListSchema);
export default ChatList;
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
      type: Schema.Types.ObjectId,
      ref: 'chat_stream_users'
    }],
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'chat_stream_users'
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
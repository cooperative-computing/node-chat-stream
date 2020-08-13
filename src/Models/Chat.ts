import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    text: {
      type: String
    },
    chat_list_id: {
      type: Schema.Types.ObjectId,
      ref: 'chat_stream_chat_list'
    },
    sender: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
chatSchema.plugin(paginate);

let Chat = mongoose.model('chat_stream_chat', chatSchema);
export default Chat;
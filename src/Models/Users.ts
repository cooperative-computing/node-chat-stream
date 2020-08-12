import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;
const usersSchema = new Schema(
  {
    name: {
      type: String
    },
    image: {
      type: String
    },
    email: {
      type: String
    },
    user_id: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
usersSchema.plugin(paginate);

let Users = mongoose.model('chat_stream_users', usersSchema);
export default Users;
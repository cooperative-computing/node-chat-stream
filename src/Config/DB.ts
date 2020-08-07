import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const Connect = (url) => mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
export default Connect;
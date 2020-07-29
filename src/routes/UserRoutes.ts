import express from 'express';
import Helper from '../Helper';
import Users from '../Models/Users';

const UsersRouter = express.Router();

UsersRouter.route("/").get(async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let query = {};
  let user_id = req.query.user_id;
  if (user_id) query = { _id: { $not: { $in: [user_id] } } } // exclude current user
  let users = await Users.paginate(query, { page, limit });
  Helper.sendPaginationResponse(res, users);
});

UsersRouter.route("/").post((req, res, next) => {
  if (req.body.name) {
    let user = new Users({ name: req.body.name, image: req.body.image });
    user.save();
    Helper.sendResponse(res, user);
  }
});

// Import Users APi
UsersRouter.route("/import").post((req, res, next) => {
  let users = req.body.users;
  if (users && users.length > 0) {
    Users.insertMany(users);
    Helper.messageResponse(res, 'Users added successfully!');
  }
  else Helper.errorResponse(res, 'users is missing!');
});



export default UsersRouter;
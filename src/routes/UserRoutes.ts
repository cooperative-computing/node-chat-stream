import express from 'express';
import Helper from '../Helper';
import Users from '../Models/Users';

const UsersRouter = express.Router();

UsersRouter.route("/").get(async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let query = {};
  let user_id = req.query.user_id;
  let fetch_users = req.query.fetch_users;
  if (user_id) query = { user_id: { $not: { $in: [user_id] } } } // exclude current user
  if (fetch_users) query = { user_id: { $in: [fetch_users] } } // fetch spcific users
  let users = await Users.paginate(query, { page, limit });
  Helper.sendPaginationResponse(res, users);
});

UsersRouter.route("/").post((req, res, next) => {
  console.log("add user ", req.body)
  if (req.body.name || req.body.email) {
    let user = new Users({ name: req.body.name, image: req.body.image, email: req.body.email, user_id: req.body.user_id });
    user.save();
    Helper.sendResponse(res, user);
  }
});

// Import Users APi
UsersRouter.route("/import").post((req, res, next) => {
  console.log("req.body ", req.body);
  let users = req.body.users;
  if (users && users.length > 0) {
    users.map(async (item) => {
      let email = item.email;
      if (email) {
        let userExist = await Users.countDocuments({ email });
        if (!userExist) {
          let user = new Users({ name: item.name, image: item.image, email, user_id: item.user_id });
          user.save();
        }
      }
    });
    // Users.insertMany(users);
    Helper.messageResponse(res, 'Users added successfully!');
  }
  else Helper.errorResponse(res, 'users is missing!');
});



export default UsersRouter;
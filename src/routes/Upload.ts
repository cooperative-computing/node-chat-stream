import express from 'express';
import path from 'path';
import fs from 'fs';

const __dirname_ = path.resolve();
const Upload = express.Router();

Upload.route("/*").get(async (req, res, next) => {
  let url = __dirname_ + '/uploads' + req.path;
  if (fs.existsSync(url)) {
    res.sendFile(url);
  }
  else {
    res.statusCode = 400;
    res.json({ status: 'failed', error: "File not found!" });
  }
});

export default Upload;
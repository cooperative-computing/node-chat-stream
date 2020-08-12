"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var Schema = mongoose_1.default.Schema;
var usersSchema = new Schema({
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
}, {
    timestamps: true
});
usersSchema.plugin(mongoose_paginate_v2_1.default);
var Users = mongoose_1.default.model('chat_stream_users', usersSchema);
exports.default = Users;

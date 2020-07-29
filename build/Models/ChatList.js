"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var Schema = mongoose_1.default.Schema;
var ChatListSchema = new Schema({
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
}, {
    timestamps: true
});
ChatListSchema.plugin(mongoose_paginate_v2_1.default);
var ChatList = mongoose_1.default.model('chat_stream_chat_list', ChatListSchema);
exports.default = ChatList;

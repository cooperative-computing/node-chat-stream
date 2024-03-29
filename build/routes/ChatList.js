"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ChatList_1 = __importDefault(require("../Models/ChatList"));
var ChatHistory_1 = __importDefault(require("../Models/ChatHistory"));
var Chat_1 = __importDefault(require("../Models/Chat"));
var Helper_1 = __importDefault(require("../Helper"));
var ChatListRoutes = express_1.default.Router();
ChatListRoutes.route("/").get(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, query, param, user_id, users_info_Url, chat_type, paginationData, chatInfo, _a, _b, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                page = req.query.page || 1;
                limit = req.query.limit || 20;
                query = {};
                param = req.query;
                user_id = param.user_id;
                users_info_Url = param.users_info_Url;
                if (!(user_id && param.chat_type)) return [3 /*break*/, 7];
                user_id = String(user_id);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                chat_type = param.chat_type;
                query = { chat_type: chat_type, receivers: { $all: [user_id] } };
                return [4 /*yield*/, ChatList_1.default.paginate(query, {
                        page: page,
                        limit: limit,
                        sort: { createdAt: -1 },
                        lean: true,
                    })];
            case 2:
                paginationData = _c.sent();
                chatInfo = { chat_type: chat_type, user_id: param.user_id, users: [] };
                //add last msg/chat in chatlist
                _a = paginationData;
                return [4 /*yield*/, Helper_1.default.addLastChatInList(paginationData.docs)];
            case 3:
                //add last msg/chat in chatlist
                _a.docs = _c.sent();
                _b = chatInfo;
                return [4 /*yield*/, Helper_1.default.addUserInfoInChatList(users_info_Url, paginationData.docs)];
            case 4:
                _b.users = _c.sent();
                Helper_1.default.sendPaginationResponse(res, paginationData, chatInfo);
                return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                Helper_1.default.sendNotFoundResponse(res, param.chat_type == "user-group" ? "Group" : "Chat list");
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                Helper_1.default.sendNotFoundResponse(res, param.chat_type == "user-group" ? "Group" : "Chat list");
                _c.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
//Fetch Chat for user to multi-user and user to group
ChatListRoutes.route("/chat").get(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, query, param, paginationData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = req.query.page || 1;
                limit = req.query.limit || 20;
                query = {};
                param = req.query;
                if (!param.chat_list_id) return [3 /*break*/, 2];
                query = { chat_list_id: param.chat_list_id };
                return [4 /*yield*/, Chat_1.default.paginate(query, {
                        page: page,
                        limit: limit,
                        sort: { createdAt: -1 },
                    })];
            case 1:
                paginationData = _a.sent();
                Helper_1.default.sendPaginationResponse(res, paginationData);
                return [3 /*break*/, 3];
            case 2:
                Helper_1.default.sendNotFoundResponse(res, "message");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
//Fetch Chat for user to user
ChatListRoutes.route("/user-user-chat").get(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, query, param, sender, receiver, chat_list, paginationData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = req.query.page || 1;
                limit = req.query.limit || 20;
                query = {};
                param = req.query;
                sender = param.sender;
                receiver = param.receiver;
                if (!(sender && receiver)) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                query = Helper_1.default.userToUserQuery(sender, receiver);
                return [4 /*yield*/, ChatList_1.default.findOne(query)];
            case 2:
                chat_list = _a.sent();
                return [4 /*yield*/, Chat_1.default.paginate({ chat_list_id: chat_list._id }, { page: page, limit: limit, sort: { createdAt: -1 } })];
            case 3:
                paginationData = _a.sent();
                Helper_1.default.sendPaginationResponse(res, paginationData, { sender: sender, receiver: receiver });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                Helper_1.default.sendNotFoundResponse(res, "message");
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                Helper_1.default.sendNotFoundResponse(res, "message");
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
//Add Chat
ChatListRoutes.route("/chat").post(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var body, sender, chat_list_id, text, chatList, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                sender = body.sender;
                chat_list_id = body.chat_list_id;
                text = body.text;
                if (!(sender && chat_list_id && text)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, new Chat_1.default({ sender: sender, chat_list_id: chat_list_id, text: text })];
            case 2:
                chatList = _a.sent();
                return [4 /*yield*/, chatList.save()];
            case 3:
                _a.sent();
                Helper_1.default.sendResponse(res, chatList);
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                Helper_1.default.errorResponse(res, "Something went wrong.Please try again.");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
//Add ChatList/Group
ChatListRoutes.route("/add").post(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var body, receivers, allIds, data, chatList, query, get_chatList, getData, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                receivers = body.receivers || [];
                if (!(body.created_by && body.receivers && body.chat_type)) return [3 /*break*/, 12];
                allIds = __spreadArray(__spreadArray([], receivers, true), [body.created_by], false);
                data = {
                    chat_type: body.chat_type,
                    created_by: body.created_by,
                    receivers: allIds,
                    name: "",
                    image: "",
                };
                if (body.chat_type == "user-group") {
                    data.name = body.name;
                    data.image = body.image;
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                chatList = void 0;
                if (!(body.chat_type == "user-user")) return [3 /*break*/, 7];
                query = Helper_1.default.userToUserChatListQuery(body.created_by, body.receivers[0]);
                return [4 /*yield*/, ChatList_1.default.findOne(query)];
            case 2:
                get_chatList = _a.sent();
                if (!!get_chatList) return [3 /*break*/, 5];
                return [4 /*yield*/, new ChatList_1.default(data)];
            case 3:
                chatList = _a.sent();
                return [4 /*yield*/, chatList.save()];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                chatList = get_chatList;
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                chatList = new ChatList_1.default(data);
                chatList.save();
                _a.label = 8;
            case 8: return [4 /*yield*/, ChatList_1.default.find({ _id: chatList._id })];
            case 9:
                getData = _a.sent();
                Helper_1.default.sendResponse(res, getData);
                return [3 /*break*/, 11];
            case 10:
                e_2 = _a.sent();
                Helper_1.default.errorResponse(res, "Something went wrong.Please try again.");
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 13];
            case 12:
                Helper_1.default.errorResponse(res, "created_by or chat_type is missing/");
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); });
//Update receivers in ChatList/Group
ChatListRoutes.route("/update").post(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var chat_list_id, receivers, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chat_list_id = req.body.chat_list_id;
                receivers = req.body.receivers;
                if (!(chat_list_id && receivers)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ChatList_1.default.findByIdAndUpdate({ _id: chat_list_id }, { receivers: receivers })];
            case 2:
                _a.sent();
                Helper_1.default.messageResponse(res, "Receivers Updated successfully!");
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                Helper_1.default.errorResponse(res, "Something went wrong.Please try again.");
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                Helper_1.default.errorResponse(res, "Something went wrong.Please try again.");
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
//Remove ChatList/Group
ChatListRoutes.route("/remove").post(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, query, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ids = req.body.ids;
                if (!(ids && ids.length > 0)) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                query = { _id: ids };
                return [4 /*yield*/, ChatList_1.default.deleteMany(query)];
            case 2:
                _a.sent();
                return [4 /*yield*/, Chat_1.default.deleteMany({ chat_list_id: { $in: ids } })];
            case 3:
                _a.sent();
                Helper_1.default.messageResponse(res, "Removed successfully!");
                return [3 /*break*/, 5];
            case 4:
                e_4 = _a.sent();
                Helper_1.default.errorResponse(res, "Something went wrong.Please try again.");
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                Helper_1.default.errorResponse(res, "ids missing.");
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
ChatListRoutes.route("/delete").delete(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var chatList, _a, _b, _c, _i, i, _d, chat_list_id, userId, e_5;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                chatList = req.body.chatList;
                if (!(chatList.length > 0)) return [3 /*break*/, 7];
                _a = chatList;
                _b = [];
                for (_c in _a)
                    _b.push(_c);
                _i = 0;
                _e.label = 1;
            case 1:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                _c = _b[_i];
                if (!(_c in _a)) return [3 /*break*/, 5];
                i = _c;
                _d = chatList[i], chat_list_id = _d.chat_list_id, userId = _d.userId;
                _e.label = 2;
            case 2:
                _e.trys.push([2, 4, , 5]);
                return [4 /*yield*/, ChatHistory_1.default.updateOne({ chat_list_id: chat_list_id, userId: userId }, { $set: { chat_list_id: chat_list_id, userId: userId } }, { upsert: true })];
            case 3:
                _e.sent();
                return [3 /*break*/, 5];
            case 4:
                e_5 = _e.sent();
                Helper_1.default.errorResponse(res, "Something went wrong.Please try again.");
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6:
                Helper_1.default.messageResponse(res, "Deleted successfully!");
                return [3 /*break*/, 8];
            case 7:
                Helper_1.default.errorResponse(res, "ids missing.");
                _e.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
//Fetch Chat for user to multi-user and user to group
ChatListRoutes.route("/get_details").get(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var chat_type, created_by, group_name, query, chat_list_details;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chat_type = req.query.chat_type;
                created_by = req.query.created_by;
                group_name = req.query.group_name;
                query = {};
                if (!(chat_type && created_by)) return [3 /*break*/, 2];
                created_by = String(created_by);
                query = { created_by: created_by, chat_type: chat_type };
                if (group_name)
                    query.name = group_name;
                return [4 /*yield*/, ChatList_1.default.findOne(query)];
            case 1:
                chat_list_details = _a.sent();
                console.log("get_details ", chat_list_details);
                Helper_1.default.sendResponse(res, chat_list_details);
                return [3 /*break*/, 3];
            case 2:
                Helper_1.default.sendNotFoundResponse(res, "created_by or chat_type missing.");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = ChatListRoutes;

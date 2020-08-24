"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Chat_1 = __importDefault(require("./Models/Chat"));
var Users_1 = __importDefault(require("./Models/Users"));
var ChatList_1 = __importDefault(require("./Models/ChatList"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var Helper = {
    sendResponse: function (res, data) {
        res.statusCode = 200;
        res.json({ data: data, status: 'success' });
    },
    sendNotFoundResponse: function (res, name) {
        res.statusCode = 200;
        res.json({ data: [], error: 'Not found any ' + name + '!' });
    },
    errorResponse: function (res, msg) {
        res.statusCode = 400;
        res.json({ status: 'failed', error: msg });
    },
    messageResponse: function (res, message) {
        res.statusCode = 200;
        res.json({ status: 'success', message: message });
    },
    addChat: function (chat) {
        var chatMessage = new Chat_1.default({ text: chat.text, sender: String(chat.sender), chat_list_id: chat.chat_list_id });
        chatMessage.save();
    },
    sendPaginationResponse: function (res, records, params) {
        if (params === void 0) { params = {}; }
        res.statusCode = 200;
        var response = __assign(__assign({}, params), { data: records.docs, totalDocs: records.totalDocs, limit: records.limit, page: records.page, totalPages: records.totalPages, pagingCounter: records.pagingCounter, hasPrevPage: records.hasPrevPage, hasNextPage: records.hasNextPage, prevPage: records.prevPage, nextPage: records.nextPage });
        res.json(response);
    },
    sendMultiUserMsg: function (room, clients, event) {
        var allIds = room.receivers;
        allIds.splice(allIds.indexOf(event.sender), 1); // removed sender
        allIds.forEach(function (item) {
            if (item && clients[item]) {
                var channelName_1 = room.chat_type == 'user-group' ? 'group-message' : 'multi-user-message';
                clients[item].forEach(function (cli) { return cli.emit(channelName_1, event); });
            }
        });
    },
    userToUserChat: function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var sender, receiver, chat_list, query;
        return __generator(this, function (_a) {
            sender = event.sender;
            receiver = event.receiver;
            if (sender && receiver) {
                chat_list = event.chat_list_id;
                if (!chat_list) {
                    query = { chat_type: 'user-user', created_by: sender, receivers: [receiver, sender] };
                    chat_list = new ChatList_1.default(query);
                    chat_list.save();
                    event.chat_list_id = chat_list._id;
                }
                Helper.addChat(event);
            }
            return [2 /*return*/];
        });
    }); },
    userToUserQuery: function (sender, receiver) {
        return { $or: [{ chat_type: 'user-user', created_by: String(sender), receivers: [String(receiver)] }, { chat_type: 'user-user', created_by: String(receiver), receivers: [String(sender)] }] };
    },
    userToUserChatListQuery: function (sender, receiver) {
        return { $or: [{ chat_type: 'user-user', created_by: sender, receivers: [receiver, sender] }, { chat_type: 'user-user', created_by: receiver, receivers: [sender, receiver] }] };
    },
    getUserId: function (user) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (user._id)
                return [2 /*return*/, user._id];
            if (user.user_id)
                return [2 /*return*/, user.user_id];
            return [2 /*return*/, ''];
        });
    }); },
    userIdToMongoId: function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
        var getUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Users_1.default.findOne({ user_id: user_id })];
                case 1:
                    getUser = _a.sent();
                    return [2 /*return*/, getUser._id];
            }
        });
    }); },
    addLastChatInList: function (list) {
        var _this = this;
        return Promise.all(list.map(function (item, index) { return __awaiter(_this, void 0, void 0, function () {
            var chat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Chat_1.default.findOne({ chat_list_id: item._id }, { text: 1, sender: 1 }).sort({ createdAt: -1 })];
                    case 1:
                        chat = _a.sent();
                        item.chat = chat;
                        return [2 /*return*/, item];
                }
            });
        }); }));
    },
    getUserDetails: function (url, ids) { return __awaiter(void 0, void 0, void 0, function () {
        var users, headers, getUsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = url + '?';
                    ids.map(function (id) { return url += 'ids[]=' + parseInt(id) + '&'; });
                    users = [];
                    headers = {
                        "Content-Type": "application/json",
                    };
                    return [4 /*yield*/, node_fetch_1.default(url, { method: 'get', headers: headers })];
                case 1:
                    getUsers = _a.sent();
                    return [4 /*yield*/, getUsers.json()];
                case 2:
                    getUsers = _a.sent();
                    if (getUsers.users)
                        users = getUsers.users;
                    return [2 /*return*/, users];
            }
        });
    }); },
    chatAddUsers: function (data, users) {
        if (data === void 0) { data = []; }
        if (users === void 0) { users = []; }
        for (var chatIndex = 0; chatIndex < data.length; chatIndex++) {
            for (var usersIndex = 0; usersIndex < users.length; usersIndex++) {
                if (data[chatIndex].sender == users[usersIndex].id) {
                    data[chatIndex].user = users[usersIndex];
                }
            }
        }
        return data;
    }
};
exports.default = Helper;

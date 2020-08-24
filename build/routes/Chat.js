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
var express_1 = __importDefault(require("express"));
var ChatList_1 = __importDefault(require("../Models/ChatList"));
var Chat_1 = __importDefault(require("../Models/Chat"));
var Helper_1 = __importDefault(require("../Helper"));
var ChatRoutes = express_1.default.Router();
//Fetch Chat for user to multi-user and user to group
ChatRoutes.route("/").get(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, query, param, chat_list_id, chat_type, created_by, name, userDetailsUrl, get_chatList, paginationData, getUserDetails, query_1, get_chatList, getUserDetails, paginationData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = req.query.page || 1;
                limit = req.query.limit || 20;
                query = {};
                param = req.query;
                chat_list_id = param.chat_list_id;
                chat_type = param.chat_type;
                created_by = param.created_by;
                name = param.name;
                userDetailsUrl = param.userDetailsUrl;
                if (!(chat_list_id && userDetailsUrl)) return [3 /*break*/, 4];
                query = { chat_list_id: chat_list_id };
                return [4 /*yield*/, ChatList_1.default.findOne({ _id: chat_list_id })];
            case 1:
                get_chatList = _a.sent();
                console.log("get_chatList ", get_chatList);
                return [4 /*yield*/, Chat_1.default.paginate(query, { page: page, limit: limit, sort: { createdAt: -1 }, lean: true })];
            case 2:
                paginationData = _a.sent();
                return [4 /*yield*/, Helper_1.default.getUserDetails(userDetailsUrl, get_chatList.receivers)];
            case 3:
                getUserDetails = _a.sent();
                paginationData.docs = Helper_1.default.chatAddUsers(paginationData.docs, getUserDetails);
                Helper_1.default.sendPaginationResponse(res, paginationData);
                return [3 /*break*/, 10];
            case 4:
                if (!(chat_type && created_by)) return [3 /*break*/, 9];
                query_1 = { chat_type: chat_type, created_by: created_by };
                if (name)
                    query_1.name = name;
                return [4 /*yield*/, ChatList_1.default.findOne(query_1)];
            case 5:
                get_chatList = _a.sent();
                chat_list_id = get_chatList ? get_chatList._id : false;
                if (!(chat_list_id && userDetailsUrl)) return [3 /*break*/, 8];
                return [4 /*yield*/, Helper_1.default.getUserDetails(userDetailsUrl, get_chatList.receivers)];
            case 6:
                getUserDetails = _a.sent();
                return [4 /*yield*/, Chat_1.default.paginate({ chat_list_id: chat_list_id }, { page: page, limit: limit, sort: { createdAt: -1 }, lean: true })];
            case 7:
                paginationData = _a.sent();
                paginationData.docs = Helper_1.default.chatAddUsers(paginationData.docs, getUserDetails);
                return [2 /*return*/, Helper_1.default.sendPaginationResponse(res, paginationData, { chat_list_id: chat_list_id })];
            case 8:
                Helper_1.default.sendNotFoundResponse(res, 'Group/chatlist not found.');
                return [3 /*break*/, 10];
            case 9:
                Helper_1.default.sendNotFoundResponse(res, 'message');
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
exports.default = ChatRoutes;

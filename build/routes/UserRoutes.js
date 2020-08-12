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
var Helper_1 = __importDefault(require("../Helper"));
var Users_1 = __importDefault(require("../Models/Users"));
var UsersRouter = express_1.default.Router();
UsersRouter.route("/").get(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, query, user_id, fetch_users, users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = req.query.page || 1;
                limit = req.query.limit || 10;
                query = {};
                user_id = req.query.user_id;
                fetch_users = req.query.fetch_users;
                if (user_id)
                    query = { user_id: { $not: { $in: [user_id] } } }; // exclude current user
                if (fetch_users)
                    query = { user_id: { $in: [fetch_users] } }; // fetch spcific users
                return [4 /*yield*/, Users_1.default.paginate(query, { page: page, limit: limit })];
            case 1:
                users = _a.sent();
                Helper_1.default.sendPaginationResponse(res, users);
                return [2 /*return*/];
        }
    });
}); });
UsersRouter.route("/").post(function (req, res, next) {
    console.log("add user ", req.body);
    if (req.body.name || req.body.email) {
        var user = new Users_1.default({ name: req.body.name, image: req.body.image, email: req.body.email, user_id: req.body.user_id });
        user.save();
        Helper_1.default.sendResponse(res, user);
    }
});
// Import Users APi
UsersRouter.route("/import").post(function (req, res, next) {
    console.log("req.body ", req.body);
    var users = req.body.users;
    if (users && users.length > 0) {
        users.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
            var email, userExist, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = item.email;
                        if (!email) return [3 /*break*/, 2];
                        return [4 /*yield*/, Users_1.default.countDocuments({ email: email })];
                    case 1:
                        userExist = _a.sent();
                        if (!userExist) {
                            user = new Users_1.default({ name: item.name, image: item.image, email: email, user_id: item.user_id });
                            user.save();
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        // Users.insertMany(users);
        Helper_1.default.messageResponse(res, 'Users added successfully!');
    }
    else
        Helper_1.default.errorResponse(res, 'users is missing!');
});
exports.default = UsersRouter;

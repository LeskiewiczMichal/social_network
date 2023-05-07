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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendRequests = exports.sendFriendRequest = exports.deleteFriend = exports.addFriend = exports.getFriends = exports.getAllUsers = exports.getUser = exports.deleteUser = exports.updateUserData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = (yield models_1.User.find());
        return res.json({ users });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return (0, utils_1.handleError)(res, 'Users not found', 404);
        }
        return (0, utils_1.handleError)(res, utils_1.ERROR_MESSAGE, 500);
    }
});
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield models_1.User.findById(req.params.userId));
        res.json({ user });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return (0, utils_1.handleError)(res, 'User not found', 404);
        }
        return (0, utils_1.handleError)(res, utils_1.ERROR_MESSAGE, 500);
    }
});
exports.getUser = getUser;
const updateUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.firstName) {
            user.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            user.lastName = req.body.lastName;
        }
        if (req.body.birthday) {
            user.birthday = req.body.birthday;
        }
        yield user.save();
        return res.json({ message: 'Update successfull', user });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return (0, utils_1.handleError)(res, 'User not found', 404);
        }
        return (0, utils_1.handleError)(res, utils_1.ERROR_MESSAGE, 500);
    }
});
exports.updateUserData = updateUserData;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        yield models_1.User.deleteOne({ _id: user.id });
        return res.json({ message: 'User deleted succesfully' });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return (0, utils_1.handleError)(res, 'User not found', 404);
        }
        return (0, utils_1.handleError)(res, utils_1.ERROR_MESSAGE, 500);
    }
});
exports.deleteUser = deleteUser;
const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield models_1.User.findById(req.params.userId));
        yield user.populate('friends');
        return res.json({ users: user.friends });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return (0, utils_1.handleError)(res, 'User not found', 404);
        }
        return (0, utils_1.handleError)(res, utils_1.ERROR_MESSAGE, 500);
    }
});
exports.getFriends = getFriends;
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const newFriend = (yield models_1.User.findById(req.params.friendId));
        const friendIdIndex = user.friendRequests.indexOf(newFriend.id);
        if (friendIdIndex !== -1) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            user.friendRequests.splice(friendIdIndex, 1)[0];
        }
        else {
            return res
                .status(404)
                .json({ error: "User was not on friend's requests list" });
        }
        user.friends.push(newFriend.id);
        yield user.save();
        return res.json({ message: 'Friend added successfully', user });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return (0, utils_1.handleError)(res, 'User not found', 404);
        }
        return (0, utils_1.handleError)(res, utils_1.ERROR_MESSAGE, 500);
    }
});
exports.addFriend = addFriend;
const deleteFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const friend = (yield models_1.User.findById(req.params.friendId));
        if (!user.friends.includes(friend.id)) {
            return res.status(404).json({ error: "User's were not friends" });
        }
        user.friends = user.friends.filter((id) => id.toString() !== friend.id.toString());
        friend.friends = friend.friends.filter((id) => id.toString() !== user.id.toString());
        yield user.save();
        yield friend.save();
        return res.json({ message: 'Friend deleted successfully', user });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return (0, utils_1.handleError)(res, 'User not found', 404);
        }
        return (0, utils_1.handleError)(res, utils_1.ERROR_MESSAGE, 500);
    }
});
exports.deleteFriend = deleteFriend;
const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const friend = (yield models_1.User.findById(req.params.userId));
        if (friend.friendRequests.includes(user.id)) {
            return res.status(400).json({ error: 'Friend request was already sent' });
        }
        friend.friendRequests.push(user.id);
        yield friend.save();
        return res.json({ message: 'Friend request was sent successfully' });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return (0, utils_1.handleError)(res, 'User not found', 404);
        }
        return (0, utils_1.handleError)(res, utils_1.ERROR_MESSAGE, 500);
    }
});
exports.sendFriendRequest = sendFriendRequest;
const getFriendRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // await user.populate('friendRequests');
        return res.json({ user });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            return (0, utils_1.handleError)(res, 'User not found', 404);
        }
        return (0, utils_1.handleError)(res, utils_1.ERROR_MESSAGE, 500);
    }
});
exports.getFriendRequests = getFriendRequests;

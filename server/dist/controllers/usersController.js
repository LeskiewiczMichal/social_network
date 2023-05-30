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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePic = exports.addFriend = exports.getFriends = exports.getUsers = exports.deleteUser = exports.updateUserData = void 0;
const models_1 = require("../models");
const types_1 = require("../types");
const utils_1 = require("../utils");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usersList, limit, friendRequests, firstName, lastName } = req.query;
        const dbQuery = models_1.User.find();
        if (limit) {
            dbQuery.limit(parseInt(limit, 10));
        }
        if (usersList) {
            const usersArray = Array.isArray(usersList) ? usersList : [usersList];
            dbQuery.where('_id').in(usersArray);
        }
        if (firstName) {
            const formattedFirstName = (0, utils_1.capitalizeFirstLetter)(String(firstName));
            dbQuery.where({ firstName: formattedFirstName });
        }
        if (lastName) {
            const formattedLastName = (0, utils_1.capitalizeFirstLetter)(String(lastName));
            dbQuery.where({ lastName: formattedLastName });
        }
        if (friendRequests) {
            dbQuery.select('+friendRequests');
            const users = (yield dbQuery.exec());
            return res.json({ users });
        }
        const users = (yield dbQuery.exec());
        return res.json({ users });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.getUsers = getUsers;
const updateUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { removeFriend, removeFriendRequest } = req.query;
        const { email, firstName, lastName, birthday, about, city, country } = req.body;
        if (removeFriendRequest) {
            const { id: friendRequestId } = (yield models_1.User.findById(removeFriendRequest));
            if (!user.friendRequests.includes(friendRequestId)) {
                throw new types_1.ErrorTypes.BadRequestError('User was not on friend requests list');
            }
            user.friendRequests = user.friendRequests.filter((id) => id.toString() !== friendRequestId.toString());
        }
        if (removeFriend) {
            const friend = (yield models_1.User.findById(removeFriend));
            if (!user.friends.includes(friend.id)) {
                throw new types_1.ErrorTypes.BadRequestError("User's were not friends");
            }
            user.friends = user.friends.filter((id) => id.toString() !== friend.id.toString());
            friend.friends = friend.friends.filter((id) => id.toString() !== user.id.toString());
            yield friend.save();
        }
        if (email) {
            user.email = email;
        }
        if (firstName) {
            user.firstName = (0, utils_1.capitalizeFirstLetter)(String(firstName));
        }
        if (lastName) {
            user.lastName = (0, utils_1.capitalizeFirstLetter)(String(lastName));
        }
        if (birthday) {
            user.birthday = birthday;
        }
        if (about) {
            user.about = about;
        }
        if (city) {
            user.city = (0, utils_1.capitalizeFirstLetter)(String(city));
        }
        if (country) {
            user.country = (0, utils_1.capitalizeFirstLetter)(String(country));
        }
        yield user.save();
        return res.json({ message: 'Update successfull', user });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.updateUserData = updateUserData;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        yield models_1.User.deleteOne({ _id: userId });
        return res.json({ message: 'User deleted succesfully' });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.deleteUser = deleteUser;
const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = (yield models_1.User.findById(userId));
        yield user.populate('friends');
        return res.json({ users: user.friends });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.getFriends = getFriends;
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { friendId } = req.params;
        const user = req.user;
        const { id: newFriendId } = (yield models_1.User.findById(friendId));
        const friendIdIndex = user.friendRequests.indexOf(newFriendId);
        if (friendIdIndex !== -1) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            user.friendRequests.splice(friendIdIndex, 1)[0];
        }
        else {
            throw new types_1.ErrorTypes.BadRequestError("User was not on friend's requests list");
        }
        user.friends.push(newFriendId);
        yield user.save();
        return res.json({ message: 'Friend added successfully' });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.addFriend = addFriend;
const uploadProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { file } = req;
        if (!file) {
            throw new types_1.ErrorTypes.NotFoundError();
        }
        const pictureUrl = `/photos/profilePictures/${file.filename}`;
        user.profilePicture = pictureUrl;
        yield user.save();
        return res.json({ message: 'Profile picture updated successfully', user });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.uploadProfilePic = uploadProfilePic;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const models_1 = require("../models");
const createFakeUsers = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultUserOne = Object.assign({ _id: props.ids.one, firstName: 'John', lastName: 'Doe', password: 'password123', email: 'john.doe@example.com', friends: [], friendRequests: [], birthday: new Date('1990-01-01') }, props.userOne);
    const defaultUserTwo = Object.assign({ _id: props.ids.two, firstName: 'Jane', lastName: 'Doe', password: 'password456', email: 'jane.doe@example.com', friends: [], friendRequests: [], birthday: new Date('1995-05-04'), googleId: '5234553455' }, props.userTwo);
    const defaultUserThree = Object.assign({ _id: props.ids.three, firstName: 'Marry', lastName: 'Christmas', password: 'password90', email: 'marry.christmas@example.com', friends: [], friendRequests: [], birthday: new Date('2000-03-09') }, props.userThree);
    const userOne = new models_1.User(defaultUserOne);
    const userTwo = new models_1.User(defaultUserTwo);
    const userThree = new models_1.User(defaultUserThree);
    const userOneToken = jwt.sign({ id: props.ids.one }, process.env.SECRET, {
        expiresIn: '1h',
    });
    const userTwoToken = jwt.sign({ id: props.ids.two }, process.env.SECRET, {
        expiresIn: '1h',
    });
    const userThreeToken = jwt.sign({ id: props.ids.three }, process.env.SECRET, {
        expiresIn: '1h',
    });
    yield userOne.save();
    yield userTwo.save();
    yield userThree.save();
    const expectedUserOne = Object.assign(Object.assign({}, defaultUserOne), { _id: props.ids.one.toString(), birthday: '1990-01-01T00:00:00.000Z' });
    const expectedUserTwo = Object.assign(Object.assign({}, defaultUserTwo), { _id: props.ids.two.toString(), birthday: '1995-05-04T00:00:00.000Z' });
    const expectedUserThree = Object.assign(Object.assign({}, defaultUserThree), { _id: props.ids.three.toString(), birthday: '2000-03-09T00:00:00.000Z' });
    return {
        one: expectedUserOne,
        two: expectedUserTwo,
        three: expectedUserThree,
        tokens: { one: userOneToken, two: userTwoToken, three: userThreeToken },
    };
});
exports.default = createFakeUsers;

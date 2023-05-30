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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const models_1 = require("../models");
const createFakeUsers = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultUserOne = Object.assign({ _id: props.ids.one, firstName: 'John', lastName: 'Doe', password: 'password123', email: 'john.doe@example.com', friends: [], friendRequests: [], birthday: new Date('1990-01-01'), country: 'Poland', city: 'Sieradz', postalCode: '98-200', about: 'test', profilePicture: '/test/test.png' }, props.userOne);
    const defaultUserTwo = Object.assign({ _id: props.ids.two, firstName: 'Jane', lastName: 'Doe', password: 'password456', email: 'jane.doe@example.com', friends: [], friendRequests: [], birthday: new Date('1995-05-04'), country: 'Poland', city: 'Sieradz', postalCode: '98-200', about: 'test', profilePicture: '/test/test.png', googleId: '5234553455' }, props.userTwo);
    const defaultUserThree = Object.assign({ _id: props.ids.three, firstName: 'Marry', lastName: 'Christmas', password: 'password90', email: 'marry.christmas@example.com', friends: [], friendRequests: [], birthday: new Date('2000-03-09'), country: 'Poland', city: 'Sieradz', postalCode: '98-200', about: 'test', profilePicture: '/test/test.png' }, props.userThree);
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
    const _a = Object.assign(Object.assign({}, defaultUserOne), { _id: props.ids.one.toString(), birthday: '1990-01-01T00:00:00.000Z' }), { friendRequests: df1, googleId: dg1, password: dp1 } = _a, expectedUserOne = __rest(_a, ["friendRequests", "googleId", "password"]);
    const _b = Object.assign(Object.assign({}, defaultUserTwo), { _id: props.ids.two.toString(), birthday: '1995-05-04T00:00:00.000Z' }), { friendRequests: df2, googleId: dg2, password: dp2 } = _b, expectedUserTwo = __rest(_b, ["friendRequests", "googleId", "password"]);
    const _c = Object.assign(Object.assign({}, defaultUserThree), { _id: props.ids.three.toString(), birthday: '2000-03-09T00:00:00.000Z' }), { friendRequests: df3, googleId: dg3, password: dp3 } = _c, expectedUserThree = __rest(_c, ["friendRequests", "googleId", "password"]);
    return {
        one: expectedUserOne,
        two: expectedUserTwo,
        three: expectedUserThree,
        tokens: { one: userOneToken, two: userTwoToken, three: userThreeToken },
    };
});
exports.default = createFakeUsers;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.post('/', authController_1.createAccount);
router.post('/login', authController_1.login);
router.get('/token', middleware_1.verifyToken, authController_1.authenticateUser);
router.get('/google', passport_1.default.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
}));
router.get('/google/callback', authController_1.loginGoogle);
exports.default = router;

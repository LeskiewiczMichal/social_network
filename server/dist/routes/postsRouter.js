"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postsController_1 = require("../controllers/postsController");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.use(middleware_1.verifyToken);
router.post('/:postId/likes', postsController_1.likePost);
router.delete('/:postId/likes', postsController_1.unlikePost);
router.get('/:postId', postsController_1.getPostById);
router.put('/:postId', postsController_1.updatePost);
router.delete('/:postId', postsController_1.deletePost);
router.get('/', postsController_1.getPosts);
router.post('/', postsController_1.createPost);
exports.default = router;

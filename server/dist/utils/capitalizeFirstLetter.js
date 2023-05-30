"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const capitalizeFirstLetter = (text) => {
    const newText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    return newText;
};
exports.default = capitalizeFirstLetter;

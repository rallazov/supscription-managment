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
exports.subscribeUser = void 0;
const subscriberModel_1 = __importDefault(require("../models/subscriberModel"));
const subscribeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        try {
            res.status(400).json({ message: 'Email is required' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error subscribing user' });
        }
    }
    try {
        yield (0, subscriberModel_1.default)(email);
        res.status(201).json({ message: 'Subscription successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error subscribing user' });
    }
});
exports.subscribeUser = subscribeUser;

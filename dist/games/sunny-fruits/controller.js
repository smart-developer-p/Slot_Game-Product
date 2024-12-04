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
exports.playGame = playGame;
exports.getGameConfig = getGameConfig;
const service_1 = require("./service");
const GameConfig_1 = require("../../models/GameConfig");
const gameName = "sunny-fruits";
// Play game controller
function playGame(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { betAmount } = req.body;
        try {
            // Fetch game configuration
            const gameConfig = yield getGameConfig();
            if (!gameConfig) {
                throw new Error("Game configuration not found");
            }
            const { payLines, payouts, betAmounts } = gameConfig.gameInfo;
            // Validate bet amount
            if (!betAmounts[betAmount]) {
                throw new Error("Invalid bet amount");
            }
            // Play the game
            const { reels, gameResult, bonusCheck, bonusResult } = (0, service_1._playGame)(payLines, payouts);
            const betMultiplier = betAmounts[betAmount];
            let totalWin = gameResult.totalPayout * betMultiplier;
            if (bonusCheck.isBonusTriggered && bonusResult) {
                totalWin += bonusResult.totalWin * betMultiplier;
            }
            // // Save history
            // await HistoryService.recordHistory(
            //     req.user._id,
            //     gameConfig._id as Types.ObjectId,
            //     betMultiplier,
            //     totalWin,
            //     {
            //         gameResult,
            //         bonusCheck,
            //         bonusResult
            //     }
            // );
            // Respond to the client
            res.status(200).json({
                success: true,
                message: 'Game played successfully',
                data: {
                    reels,
                    gameResult,
                    bonusCheck,
                    bonusResult,
                    totalWin,
                },
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    });
}
// Fetch or create game configuration
function getGameConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        let gameConfig = yield GameConfig_1.default.findOne({ gameName });
        if (!gameConfig) {
            // Default configuration
            const BetAmounts = [
                0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0, 1.5, 2.0,
                3.0, 4.0, 5.0, 7.5, 10.0, 20.0, 30.0, 40.0, 50.0, 75.0, 100.0,
            ];
            const PAYLINES = [
                [1, 4, 7, 10, 13], // Middle row
                [0, 3, 6, 9, 12], // Top row
                [2, 5, 8, 11, 14], // Bottom row
                [0, 4, 8, 10, 12], // Diagonal TL to BR
                [2, 4, 6, 10, 14], // Diagonal BL to TR
            ];
            const PAYOUTS = {
                Bell: { 3: 4.0, 4: 10.0, 5: 50.0 }, // means when there are 3 same symbols in a payline give win 4x, when there are 4 same symbols win 10x, when there are 5 win 50x
                Bar: { 3: 4.0, 4: 10.0, 5: 50.0 },
                Watermelon: { 3: 2.5, 4: 7.5, 5: 25.0 },
                Grapes: { 3: 2.5, 4: 7.5, 5: 25.0 },
                Orange: { 3: 1.0, 4: 3.0, 5: 10.0 },
                Lemon: { 3: 1.0, 4: 3.0, 5: 10.0 },
                Plum: { 3: 1.0, 4: 3.0, 5: 10.0 },
                Cherries: { 3: 1.0, 4: 3.0, 5: 10.0 },
                Mini: 25, // only in bonus games
                Minor: 50, // only in bonus games
                Major: 150, // only in bonus games
                Grand: 1000, // Example values for jackpots
            };
            // Create and save default game configuration
            gameConfig = new GameConfig_1.default({
                gameName,
                gameType: "slots",
                gameInfo: {
                    payLines: PAYLINES,
                    payouts: PAYOUTS,
                    betAmounts: BetAmounts,
                },
            });
            yield gameConfig.save();
        }
        return gameConfig;
    });
}
function testRTP(count) {
    return __awaiter(this, void 0, void 0, function* () {
        let wins = 0;
        let bonuswins = 0;
        const gameConfig = yield getGameConfig();
        const { payLines, payouts, betAmounts } = gameConfig.gameInfo;
        for (let i = 0; i < count; i++) {
            const { reels, gameResult, bonusCheck, bonusResult } = (0, service_1._playGame)(payLines, payouts);
            wins += gameResult.totalPayout;
            if (bonusCheck.isBonusTriggered && bonusResult) {
                bonuswins += bonusResult.totalWin;
            }
        }
        console.log(`
                bet: %s
                win:%s
                bonuswin:%s
                totalwin:%s
                RTP(win): %s%
                RTP(bonuswin): %s%
                RTP(totalwin): %s%
                `, count, wins, bonuswins, wins + bonuswins, (wins) / count * 100, (bonuswins) / count * 100, (wins + bonuswins) / count * 100);
    });
}
testRTP(100000);

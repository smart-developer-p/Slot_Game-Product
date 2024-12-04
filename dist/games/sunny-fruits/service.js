"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinReels = spinReels;
exports._playGame = _playGame;
exports.checkBonus = checkBonus;
exports.playBonusGame = playBonusGame;
exports.checkPaylines = checkPaylines;
const type_1 = require("./type");
const configProbablity = {
    JackPot: [
        0.001, // 0.5% for Major (reduced to make large wins rarer)
        0.003, // 2% for Minor (slightly reduced)
        0.005, // 3% for Mini
    ],
    BonusSymbols: [
        0.015, // for sunbonus (reduced slightly to balance Bonus RTP)
        0.035, //  for bonus
    ],
    Symbols: [
        0.11, // 10% BONUS
        0.01, // 5.5% SUNBONUS
        0.04, // 0.4% WILD
        0.05, // Bell
        0.05, // Bar
        0.08, // Grapes
        0.08, // Watermelon
        0.17, // Orange
        0.17, // Lemon
        0.17, // Plum
        0.17, // Cherries
    ],
    CountIn_PayLine: [
        0.55, // 50%: Increased to favor 3-symbol matches
        0.37, // 35%: Reduced for 4-symbol matches
        0.05, // 10%: Slightly reduced for 5-symbol matches
        0.02, // 4%
        0.01, // 1%
    ],
    pointWeights: [0.3, 0.25, 0.2, 0.15, 0.1, 0.05, 0.03, 0.02, 0.01],
};
const getRandomValue = () => Math.random();
const getRandomJackpot = () => {
    const rand = getRandomValue();
    let cumulativeProbability = 0;
    for (let i = 0; i < configProbablity.JackPot.length; i++) {
        cumulativeProbability += configProbablity.JackPot[i];
        if (rand < cumulativeProbability) {
            // Returns the corresponding symbol
            return { isJackpot: true, jackPotType: i };
        }
    }
    return { isJackpot: false };
};
const getBonusSymbol = () => {
    const rand = getRandomValue();
    let cumulativeProbability = 0;
    for (let i = 0; i < configProbablity.BonusSymbols.length; i++) {
        cumulativeProbability += configProbablity.BonusSymbols[i];
        if (rand < cumulativeProbability) {
            if (i === 0) {
                return {
                    type: type_1.SymbolTypes.SUNBONUS,
                }; // Return the corresponding PayLine count
            }
            else if (i === 1) {
                const jackpot = getRandomJackpot();
                if (jackpot.isJackpot) {
                    return {
                        type: type_1.SymbolTypes.BONUS,
                        isBonus: true,
                        isJackpot: true,
                        jackPotType: jackpot.jackPotType,
                    };
                }
                else {
                    return {
                        type: type_1.SymbolTypes.BONUS,
                        isBonus: true,
                        value: getRandomPointValue(),
                    };
                }
            }
        }
    }
    return null;
};
const getSymbol = (symbol) => {
    const rand = getRandomValue();
    let cumulativeProbability = 0;
    if (symbol !== undefined) {
        if (symbol.type == type_1.SymbolTypes.BONUS) {
            const jackpot = getRandomJackpot();
            if (jackpot.isJackpot) {
                return {
                    type: type_1.SymbolTypes.BONUS,
                    isBonus: true,
                    isJackpot: true,
                    jackPotType: jackpot.jackPotType,
                };
            }
            else {
                return {
                    type: type_1.SymbolTypes.BONUS,
                    isBonus: true,
                    value: getRandomPointValue(),
                };
            }
        }
        else {
            return symbol;
        }
    }
    for (let i = 0; i < configProbablity.Symbols.length; i++) {
        cumulativeProbability += configProbablity.Symbols[i];
        if (rand < cumulativeProbability) {
            // Returns the corresponding symbol
            if (i == type_1.SymbolTypes.BONUS) {
                const jackpot = getRandomJackpot();
                if (jackpot.isJackpot) {
                    return {
                        type: type_1.SymbolTypes.BONUS,
                        isBonus: true,
                        isJackpot: true,
                        jackPotType: jackpot.jackPotType,
                    };
                }
                else {
                    return {
                        type: type_1.SymbolTypes.BONUS,
                        isBonus: true,
                        value: getRandomPointValue(),
                    };
                }
            }
            else {
                return {
                    type: i,
                };
            }
        }
    }
    return {
        type: type_1.SymbolTypes.Lemon,
    };
};
const getCountInPayLine = () => {
    const rand = getRandomValue();
    let cumulativeProbability = 0;
    for (let i = 0; i < configProbablity.CountIn_PayLine.length; i++) {
        cumulativeProbability += configProbablity.CountIn_PayLine[i];
        if (rand < cumulativeProbability) {
            return i + 1; // Return the corresponding PayLine count
        }
    }
    return 1;
};
// Helper function to generate a random jackpot type
// Assign random point values to BONUS and SUNBONUS symbols
function getRandomPointValue() {
    const min = 1;
    const max = 9;
    let totalWeight = configProbablity.pointWeights.reduce((sum, weight) => sum + weight, 0); // Calculate the total weight
    let random = Math.random() * totalWeight; // Get a random number between 0 and total weight
    let cumulativeWeight = 0;
    for (let i = min; i <= max; i++) {
        cumulativeWeight += configProbablity.pointWeights[i - min]; // Add the weight of the current number
        if (random < cumulativeWeight) {
            return parseFloat(i.toFixed(2)); // Return the selected number, formatted to two decimal places
        }
    }
    return 1;
}
function spinReels(rows = 5, columns = 3, symbolCount = 10, paylines) {
    let symbols = Array(15).fill(null);
    paylines.forEach((payLine, id) => {
        let countInLine = getCountInPayLine(); // get random count in payline
        let symbol = getSymbol(); // get random symbol
        if (symbols[payLine[1]])
            symbol = getSymbol(symbols[payLine[1]]); //  if second symbol of payline is exist use that symbol when payline is 4 or 5
        for (let i = 0; i < 5; i++) {
            if (symbol.type !== type_1.SymbolTypes.BONUS &&
                symbol.type !== type_1.SymbolTypes.SUNBONUS) {
                if (i < countInLine) {
                    symbols[payLine[i]] = getSymbol(symbol);
                }
                else {
                    // generate other symbol
                    let otherSymbol = getSymbol();
                    while (otherSymbol.type === symbol.type) {
                        otherSymbol = getSymbol();
                    }
                    symbols[payLine[i]] = otherSymbol;
                }
            }
            else {
                symbols[payLine[i]] = getSymbol();
            }
        }
    });
    // make  2 dimesional array from generated 1 dimesional array : 15[] => 5x3[]
    let finalReturnValue = [];
    for (let i = 0; i < rows; i++) {
        let tmp = [];
        for (let j = 0; j < columns; j++) {
            tmp.push(symbols[i * 3 + j]);
        }
        finalReturnValue.push(tmp);
    }
    return finalReturnValue;
}
function _playGame(paylines, payouts) {
    const reels = spinReels(5, 3, Object.keys(type_1.SymbolTypes).length / 2, paylines);
    const gameResult = checkPaylines(reels, paylines, payouts);
    const bonusCheck = checkBonus(reels);
    let bonusResult = null;
    if (bonusCheck.isBonusTriggered) {
        bonusResult = playBonusGame(payouts, bonusCheck.bonusReels);
    }
    return {
        reels,
        gameResult,
        bonusCheck,
        bonusResult,
    };
}
function checkBonus(reels) {
    let bonusCount = 0;
    let sunBonusCount = 0;
    const bonusReels = JSON.parse(JSON.stringify(reels)); // Clone reels for bonus round
    reels.flat().forEach((symbol, index) => {
        if (symbol.isBonus)
            bonusCount++;
        if (symbol.type === type_1.SymbolTypes.SUNBONUS)
            sunBonusCount++;
        // Clear non-bonus symbols for bonus reels
        if (!symbol.isBonus && symbol.type !== type_1.SymbolTypes.SUNBONUS) {
            const row = Math.floor(index / reels[0].length);
            const col = index % reels[0].length;
            bonusReels[row][col] = null;
        }
    });
    return { isBonusTriggered: bonusCount + sunBonusCount >= 6, bonusReels };
}
function playBonusGame(payouts, initialReels) {
    var _a;
    let totalWin = 0;
    let spinsRemaining = 3;
    let spinCounts = 0;
    const rows = initialReels.length;
    const cols = initialReels[0].length;
    let reels = JSON.parse(JSON.stringify(initialReels)); // Clone initial reels for sticky symbols
    // Simulate the bonus game logic
    const getNewSunAndBonusSymbols = () => {
        var _a;
        const newSunSymbols = [];
        const bonusSymbols = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (reels[row][col]) {
                    if (!((_a = reels[row][col]) === null || _a === void 0 ? void 0 : _a.value)) {
                        newSunSymbols.push({ row, col });
                    }
                    else {
                        bonusSymbols.push({ row, col });
                    }
                }
            }
        }
        return { newSunSymbols, bonusSymbols };
    };
    const getTotalBonusAmount = () => {
        const { bonusSymbols } = getNewSunAndBonusSymbols();
        return bonusSymbols.reduce((prev, cbonusS) => {
            var _a;
            return prev + (((_a = reels[cbonusS.row][cbonusS.col]) === null || _a === void 0 ? void 0 : _a.value) || 0);
        }, 0);
    };
    const setNewSunBonusValues = () => {
        const { newSunSymbols } = getNewSunAndBonusSymbols();
        while (newSunSymbols.length > 0) {
            const newSu = newSunSymbols.shift();
            if (newSu && reels[newSu.row][newSu.col]) {
                reels[newSu.row][newSu.col].value = getTotalBonusAmount();
            }
        }
    };
    setNewSunBonusValues();
    while (spinsRemaining > 0 &&
        !(reels
            .flat()
            .every((cell) => cell &&
            (cell.type === type_1.SymbolTypes.BONUS ||
                cell.type === type_1.SymbolTypes.SUNBONUS)) && reels.flat().length === 15)) {
        let newSymbolAdded = false;
        let newSunBonusAdded = false;
        spinCounts++;
        spinsRemaining--;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (reels[row][col] === null) {
                    const newRandomBonusSymbol = getBonusSymbol();
                    if (newRandomBonusSymbol) {
                        // 25% chance to add a new symbol
                        newSymbolAdded = true;
                        if (newRandomBonusSymbol.type === type_1.SymbolTypes.BONUS) {
                            if (newRandomBonusSymbol.isJackpot) {
                                reels[row][col] = {
                                    type: newRandomBonusSymbol.type,
                                    isBonus: true,
                                    isJackpot: true,
                                    value: payouts[type_1.JackpotTypes[(newRandomBonusSymbol === null || newRandomBonusSymbol === void 0 ? void 0 : newRandomBonusSymbol.jackPotType) || "Mini"]] || 0,
                                    jackPotType: newRandomBonusSymbol.jackPotType,
                                    spinCounts,
                                };
                            }
                            else {
                                reels[row][col] = {
                                    type: newRandomBonusSymbol.type,
                                    isBonus: true,
                                    value: newRandomBonusSymbol.value,
                                    spinCounts,
                                };
                            }
                        }
                        else {
                            reels[row][col] = {
                                type: newRandomBonusSymbol.type,
                                spinCounts,
                            };
                            newSunBonusAdded = true;
                        }
                    }
                }
            }
        }
        // Reset spins if a new symbol was added
        if (newSymbolAdded) {
            spinsRemaining = 3;
            if (newSunBonusAdded) {
                setNewSunBonusValues();
            }
        }
    }
    totalWin = getTotalBonusAmount();
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (reels[row][col] && ((_a = reels[row][col]) === null || _a === void 0 ? void 0 : _a.type) == type_1.SymbolTypes.SUNBONUS) {
                reels[row][col].value = undefined;
            }
        }
    }
    // Check for Grand Jackpot (full grid of BONUS symbols)
    if (reels
        .flat()
        .every((cell) => cell &&
        (cell.type === type_1.SymbolTypes.BONUS ||
            cell.type === type_1.SymbolTypes.SUNBONUS))) {
        totalWin += payouts["Grand"] || 0;
    }
    return {
        totalWin,
        reels,
        spinCounts: spinCounts + 1,
    };
}
function checkPaylines(randomSymbols, paylines, payouts) {
    let totalPayout = 0;
    const winningLines = [];
    // Flatten the 3x5 grid column by column
    const flattenedSymbols = [];
    for (let row = 0; row < randomSymbols.length; row++) {
        for (let col = 0; col < randomSymbols[0].length; col++) {
            flattenedSymbols.push(randomSymbols[row][col]);
        }
    }
    // Evaluate each payline
    paylines.forEach((line, lineIndex) => {
        const symbolsOnLine = line.map((index) => flattenedSymbols[index]); // Get symbols for the current line
        let firstSymbol = symbolsOnLine[0];
        // Ensure the line starts matching from the leftmost column
        let matchedCount = 1; // Start with the first column as matched
        for (let i = 1; i < symbolsOnLine.length; i++) {
            const currentSymbol = symbolsOnLine[i];
            if (currentSymbol.type == firstSymbol.type ||
                currentSymbol.type == type_1.SymbolTypes.WILD) {
                matchedCount++;
            }
            else if (firstSymbol.type === type_1.SymbolTypes.WILD) {
                firstSymbol = currentSymbol;
                matchedCount++;
            }
            else {
                break; // Stop counting if there's a mismatch
            }
        }
        // Check if there's a payout for the matched symbols
        if (matchedCount >= 3) {
            const symbolName = type_1.SymbolTypes[firstSymbol.type];
            if (payouts[symbolName] && payouts[symbolName][matchedCount]) {
                const payout = payouts[symbolName][matchedCount];
                totalPayout += payout;
                // Save winning line details, including all symbols on the line
                winningLines.push({
                    lineIndex,
                    matchedSymbols: firstSymbol.type,
                    count: matchedCount,
                    payout,
                    symbolsOnLine, // Add all symbols on this line
                });
            }
        }
    });
    return {
        totalPayout,
        winningLines,
    };
}

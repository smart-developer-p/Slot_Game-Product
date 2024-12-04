"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../games/sunny-fruits/controller");
const authenticate_1 = require("../middleware/authenticate");
// Import other game controllers as needed
// Define a mapping of game IDs to their respective controllers
const controllers = {
    "sunny-fruits": controller_1.playGame,
    // Add other game controllers here
};
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.post('/:id/play', (req, res, next) => {
    const gameId = req.params.id;
    const gameController = controllers[gameId];
    if (!gameController) {
        // If the controller for the requested game ID does not exist, return 404
        return res.status(404).json({
            error: `Game with ID '${gameId}' not found.`,
        });
    }
    try {
        // Invoke the respective game controller
        gameController(req, res, next);
    }
    catch (error) {
        // Forward errors to the next middleware (error handler)
        next(error);
    }
});
exports.default = router;

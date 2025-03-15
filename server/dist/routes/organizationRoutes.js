"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organizationController_1 = require("../controllers/organizationController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload"); // Import file upload middleware
const router = express_1.default.Router();
router.post("/create", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, upload_1.upload.array("legalProofs", 5), organizationController_1.createOrganization);
router.get("/", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, organizationController_1.getOrganizations);
router.put("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, upload_1.upload.array("legalProofs", 5), organizationController_1.updateOrganization);
router.delete("/:id", auth_1.authenticateToken, auth_1.authorizeSuperAdmin, organizationController_1.deleteOrganization);
exports.default = router;

import { Router } from "express";
import cityController from "./controllers/city";

// import swaggerDocument from '../swagger.json';

// Init router and path
const router = Router();

// Add sub-routes
router.use("/cities", cityController);

// Export the base-router
export default router;

import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";
export function errorHandler(error:Error,req:Request, res:Response, next:NextFunction) {
    logger.error(error);
    return res.status(500).json({
        success:false,
        message:`Internal server error`
    })
}
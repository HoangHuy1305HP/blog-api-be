import type { Request, Response,NextFunction } from "express";
import type { JwtPayload } from "../types/jwt.js";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!;
export async function optionalAuthenticate(req:Request, res:Response, next:NextFunction) {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return next()
    }
    const token = authHeader.split(" ")[1];
    if(!token) {
        return next()
    }
    try {
        const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;
        (req as any).userId = decoded.userId;
        next()
    } catch (error) {
       
    }
}
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/jwt.js";
import bcrypt from "bcrypt";
import { createUser,findUserByEmail, updateRefreshToken, findUserById } from "../models/auth.model.js";

export async function register(req:Request, res:Response, next:NextFunction) {
    try {
        const {email,name, pass} = req.body;
    if(!email || !name || !pass) {
        return res.status(400).json({message:` Thiếu dữ liệu, vui lòng nhập đầy đủ `})
    }
    const isEmailExis = await findUserByEmail(email);
    if(isEmailExis) {
        return res.status(409).json({message:` Email đã tồn tại `})
    }
    const password = await bcrypt.hash(pass,10)
    const newUser = await createUser({email,name,password})
    return res.status(201).json({message:` Tạo user thành công `,newUser})
    } catch (error) {
        next(error)
        
    }
    
}

export async function login(req:Request, res:Response,next:NextFunction) {
    try {
        const {email,pass} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET!;
        const REFRESH_SECRET = process.env.REFRESH_SECRET!;

        if(!email || !pass) {
            return res.status(400).json({message:` Thiếu dữ liệu, vui lòng nhập đầy đủ `})
        }
        const user = await findUserByEmail(email)
        if(!user) {
            return res.status(401).json({message:` Không tìm thấy người dùng `})
        }
        const hashedPass = user.password;
        const isMatch = await bcrypt.compare(pass,hashedPass);
        if(!isMatch) {
            return res.status(401).json({message: `Unauthorized`})
        }
        const newToken = jwt.sign({userId:user.id,name:user.name, email:user.email},JWT_SECRET, {expiresIn:"15m"});
        const refreshToken = jwt.sign({userId:user.id,name:user.name, mail:user.email},REFRESH_SECRET, {expiresIn:"7d"});
        const id = user.id
        const result = await updateRefreshToken(id,refreshToken);

        return res.status(200).json({message:` Đăng nhập thành công `,accessToken: newToken,refreshToken:refreshToken})
    } catch (error) {
        
        console.log("🚀 ~ login ~ error:", error)
        next(error)
    }
    
}

export async function refreshToken(req:Request, res:Response,next:NextFunction) {
    const {token} = req.body;
    const REFRESH_SECRET = process.env.REFRESH_SECRET!;
    const JWT_SECRET = process.env.JWT_SECRET!;
    if(!token) {
        return res.status(400).json({message:` Không có token được gửi lên `});
        
    }
    let decoded: jwt.JwtPayload
    try {
         decoded = jwt.verify(token,REFRESH_SECRET) as jwt.JwtPayload;
    } catch(error) {
        return res.status(401).json({message:`Invalid or expired token`})
        }

    try {
        
        const id = decoded.userId as string ;
        const user = await findUserById(id);
        if(!user) {
            return res.status(404).json({message:` Không tìm thấy người dùng `})
        }
        const user_refreshToken = user.refreshToken
        if(user_refreshToken !== token) {
            return res.status(403).json({message:` Forbidden `})
        }
        const newAccessToken = jwt.sign({userId:user.id},JWT_SECRET,{expiresIn:"15m"})
        return res.status(200).json({messge:` Tạo token thành công `,newAccessToken});
    } catch (error) {
        next(error)
    }
}

export async function logout(req:Request, res:Response,next:NextFunction) {
    let {refreshToken} = req.body;
    const REFRESH_SECRET = process.env.REFRESH_SECRET!;
    if(!refreshToken) {
        return res.status(400).json({message:` Dữ liệu không hợp lệ `})
    }
    let decoded: jwt.JwtPayload
    try {
         decoded = jwt.verify(refreshToken,REFRESH_SECRET) as jwt.JwtPayload;
    } catch(error) {
        return res.status(401).json({message:`Invalid or expired token`})
        }
    try {
        const userId = decoded.userId;
        const user = await findUserById(userId);
        if(!user) {
            return res.status(404).json({message:` Không tìm thấy người dùng `})
        }
        const user_refreshToken = user.refreshToken;
        if(user_refreshToken !== refreshToken) {
            return res.status(403).json({message:`Forbidden`})
        }
        const result = await updateRefreshToken(userId,null)
        return res.status(200).json({message:` Đăng xuất thành công `})
    } catch (error) {
        next(error)
    }
        
    
}
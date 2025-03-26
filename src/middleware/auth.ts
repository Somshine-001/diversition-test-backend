import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticate = async (
  req: NextApiRequest,
  res: NextApiResponse,
  roles: string[] = []
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
        message_th: "ไม่ได้รับอนุญาต",
      });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        return res.status(400).json({
          status: "error",
          message: "Session expired",
          message_th: "Session หมดอายุ",
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "Session expired",
          message_th: "Session หมดอายุ",
        });
      }
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        createDate: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({
          status: "error",
          message: "User not found",
          message_th: "ไม่พบผู้ใช้",
        });
    }

    if (roles.length > 0 && !roles.includes(user.role.name)) {
      return res
        .status(403)
        .json({
          status: "error",
          message: "Forbidden",
          message_th: "ไม่มีสิทธิ์เข้าถึง",
        });
    }

    return user;
  } catch (error) {
    return res
      .status(401)
      .json({
        status: "error",
        message: "Invalid token",
        message_th: "โทเค็นไม่ถูกต้อง",
      });
  }
};

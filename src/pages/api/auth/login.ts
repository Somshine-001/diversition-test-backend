import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../../config";
import { Login } from "../../../../prisma/user";

const prisma = new PrismaClient();

export default async function handler_login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const { identifier, password } = req.body;

  const data = await Login(identifier, password);
  if (data) {
    return res.status(200).json(data);
  } else {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      message_th: "เกิดข้อผิดพลาด",
    });
  }
}

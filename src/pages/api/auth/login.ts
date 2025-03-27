import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../../config";
import { login } from "../../../../prisma/user";

const prisma = new PrismaClient();

export default async function handlerLogin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const { identifier, password } = req.body;

  const data = await login(identifier, password);
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

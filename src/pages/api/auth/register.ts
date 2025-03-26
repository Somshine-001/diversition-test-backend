import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Register } from "../../../../prisma/user";

const prisma = new PrismaClient();

export default async function handler_register(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const { email, username, password } = req.body;
  const data = await Register(email, username, password);

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

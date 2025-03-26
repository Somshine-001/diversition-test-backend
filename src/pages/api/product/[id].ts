import { PrismaClient } from "@prisma/client";
import { getOneProduct } from "../../../../prisma/product";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler_product_one(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const productId = id ? parseInt(id as string, 10) : undefined;
  if (productId) {
    const data = await getOneProduct(productId);

    if (data) {
      return res.status(200).json(data);
      
    } else {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
        message_th: "เกิดข้อผิดพลาด",
      });
    }

  } else {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      message_th: "เกิดข้อผิดพลาด",
    });
  }
}

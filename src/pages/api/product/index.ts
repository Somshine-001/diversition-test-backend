import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
} from "../../../../prisma/product";
import { authenticate } from "@/middleware/auth";

const prisma = new PrismaClient();

export default async function handler_product(req: NextApiRequest, res: NextApiResponse): Promise<any> {

  switch (req.method) {

    case "GET": {
      try {
        const page = Array.isArray(req.query.page) ? parseInt(req.query.page[0]) : parseInt(req.query.page ?? "1");
        const size = Array.isArray(req.query.size) ? parseInt(req.query.size[0]) : parseInt(req.query.size ?? "10");
        const products = await getAllProduct(page, size);

        return res.status(200).json({
          status: "success",
          data: products,
        });

      } catch (error) {

        return res.status(500).json({
          status: "error",
          message: "Something went wrong",
          message_th: "เกิดข้อผิดพลาด",
        });
      }
    }

    case "POST": {
      try {
        const user = await authenticate(req, res, ["admin", "superadmin"]);
        if (!user || res.headersSent) return;

        const { name, title, image, price, amount } = req.body;

        const product = await createProduct(name, title, image, price, amount, user.id);

        return res.status(200).json({
          status: "success",
          message: "Product created successfully",
          message_th: "สร้างสินค้าสําเร็จ",
          data: product,
        });
        
      } catch (error) {

        return res.status(500).json({
          status: "error",
          message: "Something went wrong",
          message_th: "เกิดข้อผิดพลาด",
        });
      }
    }

    case "PUT": {
      try {
        const user = await authenticate(req, res, ["admin", "superadmin"]);
        if (!user || res.headersSent) return;

        const { id, name, title, image, price, amount } = req.body;

        await prisma.product.update({
          where: {
            id,
          },
          data: {
            name,
            title,
          },
        });

        return res.status(200).json({
          status: "success",
          message: "Product updated successfully",
          message_th: "แก้ไขสินค้าสําเร็จ",
        });

      } catch (error) {

        return res.status(500).json({
          status: "error",
          message: "Something went wrong",
          message_th: "เกิดข้อผิดพลาด",
        });
      }
    }

    case "DELETE":
      try {
        const user = await authenticate(req, res, ["admin", "superadmin"]);
        if (!user || res.headersSent) return;

        const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

        if (id === undefined) {
          return res.status(400).json({
            status: "error",
            message: "Product id is required",
            message_th: "จำเป็นต้องระบุ id สินค้า",
          });
        }

        const productId = parseInt(id, 10);

        if (isNaN(productId)) {
          return res.status(400).json({
            status: "error",
            message: "Invalid product id",
            message_th: "id สินค้าไม่ถูกต้อง",
          });
        }

        await deleteProduct( productId );

        return res.status(200).json({
          status: "success",
          message: "Product deleted successfully",
          message_th: "ลบสินค้าสําเร็จ",
        });

      } catch (error) {

        return res.status(500).json({
          status: "error",
          message: "Something went wrong",
          message_th: "เกิดข้อผิดพลาด",
        });
      }

    default: {
      return res.status(405).json({
        status: "error",
        message: "Method not allowed",
        message_th: "ไม่สามารถใช้งานได้",
      });
    }
  }
}

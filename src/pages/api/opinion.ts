import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import {
  createOpinion,
  deleteOpinion,
  getAllOpinion,
} from "../../../prisma/opinion";
import { authenticate } from "@/middleware/auth";

const prisma = new PrismaClient();

export default async function handlerOpinion(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  switch (req.method) {
    case "GET": {
      try {
        const page = Array.isArray(req.query.page) ? parseInt(req.query.page[0]) : parseInt(req.query.page ?? "1");
        const size = Array.isArray(req.query.size) ? parseInt(req.query.size[0]) : parseInt(req.query.size ?? "10");
        const opinions = await getAllOpinion(page, size);

        return res.status(200).json({
          status: "success",
          data: opinions,
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
        const user = await authenticate(req, res);
        if (!user || res.headersSent) return;

        const { title, productId } = req.body;

        const opinion = await createOpinion(title, productId, user.id);

        return res.status(200).json({
          status: "success",
          message: "Opinion successfully",
          message_th: "แสดงความคิดเห็นเสร็จสิ้น",
          data: opinion,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: "error",
          message: "Something went wrong",
          message_th: "เกิดข้อผิดพลาด",
        });
      }
    }

    case "PUT": {
      try {
        const user = await authenticate(req, res);
        if (!user || res.headersSent) return;

        const { id, title } = req.body;

        await prisma.opinion.update({
          where: {
            id,
          },
          data: {
            title,
          },
        });

        return res.status(200).json({
          status: "success",
          message: "Opinion updated successfully",
          message_th: "แก้ไขความคิดเห็นสําเร็จ",
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
        const user = await authenticate(req, res);
        if (!user || res.headersSent) return;

        const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

        if (id === undefined) {
          return res.status(400).json({
            status: "error",
            message: "Opinion id is required",
            message_th: "จำเป็นต้องระบุ id ความคิดเห็น",
          });
        }

        const opinionId = parseInt(id, 10);

        if (isNaN(opinionId)) {
          return res.status(400).json({
            status: "error",
            message: "Invalid opinion id",
            message_th: "id ความคิดเห็นไม่ถูกต้อง",
          });
        }

        await deleteOpinion(opinionId);

        return res.status(200).json({
          status: "success",
          message: "Opinion deleted successfully",
          message_th: "ลบความคิดเห็นสําเร็จ",
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

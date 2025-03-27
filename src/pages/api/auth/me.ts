import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "@/middleware/auth";

export default async function handlerMe(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ 
        status: "error",
        message: "Method Not Allowed",
        message_th: "ไม่สามารถเข้าถึงได้",
    });

  const user = await authenticate(req, res);
  if (!user || res.headersSent) return;

  return res.status(200).json({ status: "success", data: user });
}

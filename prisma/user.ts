import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const login = async (identifier: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
    include: { role: true },
  });

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        status: "error",
        message: "Invalid username or password",
        message_th: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      };
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      status: "success",
      message: "Login successfully",
      message_th: "เข้าสู่ระบบสําเร็จ",
      data: token,
    };
  } else {
    return {
      status: "error",
      message: "Invalid username or password",
      message_th: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
    };
  }
};

export const register = async (
  email: string,
  username: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        roleId: 3,
      },
    });
    return {
      status: "success",
      message: "Register successfully",
      message_th: "สมัครสมาชิกสําเร็จ",
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          status: "error",
          message: "Email or username already exists",
          message_th: "อีเมลหรือชื่อผู้ใช้มีอยู่แล้ว",
        };
      }
    }
    return {
      status: "error",
      message: "Something went wrong",
      message_th: "เกิดข้อผิดพลาด",
    };
  }
};

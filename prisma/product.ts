import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (
  name: string,
  title: string,
  image: string,
  price: number,
  amount: number,
  userId: number
) => {
  const product = await prisma.product.create({
    data: {
      name: name,
      title: title,
      price: price,
      amount: amount,
      image: image,
      userId: userId,
    },
  });
  console.log({ product });
  return product;
};

export const getAllProduct = async (page: number, size: number) => {
  const products = await prisma.product.findMany({
    take: size,
    skip: (page - 1) * size,
  });
  console.log({ products });
  return products;
};

export const getOneProduct = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    console.log({ product });
    return {
      status: "success",
      data: product
    };
  } catch(error) {
    return {
      status: "error",
      message: "Something went wrong",
      message_th: "เกิดข้อผิดพลาด"
    }
  }
};

export const deleteProduct = async (id: number) => {
  await prisma.product.delete({
    where: {
      id: id,
    },
  });
};

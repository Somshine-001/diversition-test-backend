import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOpinion = async (
  title: string,
  productId: number,
  userId: number
) => {
  const opinion = await prisma.opinion.create({
    data: {
      title: title,
      productId: productId,
      userId: userId,
    },
  });
  console.log({ opinion });
  return opinion;
};

export const getAllOpinion = async (page: number, size: number) => {
  const opinions = await prisma.opinion.findMany({
    take: size,
    skip: (page - 1) * size,
  });
  console.log({ opinions });
  return opinions;
};

export const getOneOpinion = async (id: number) => {
  const opinion = await prisma.opinion.findUnique({
    where: {
      id: id,
    },
  });
  console.log({ opinion });
  return opinion;
};

export const deleteOpinion = async (id: number) => {
  await prisma.opinion.delete({
    where: {
      id: id,
    },
  });
};

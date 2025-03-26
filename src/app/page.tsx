"use client";
import { useEffect, useState } from "react";
import { fetchActionApi } from "./utils/action";

interface Product {
  id: number;
  name: string;
  title: string;
  price: number;
  amount: number;
  image?: string;
  createDate: string;
  updateDate: string;
  userId: number;
}

interface Response {
  status: string,
  message?: string,
  message_th?: string,
  data: any
}
export default function Home() {
  const [product, setProduct] = useState<Product[]>([]);
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    const res = await fetchActionApi("/product", {
      method: "GET",
    });
    const data = res.data as Response
    setProduct(data.data as Product[]);
    console.log(data.data)
  };
  return (
    <div className="global-page">
      {product &&
        product.map((p) => (
          <div key={p.id}>
            <h2>{p.name}</h2>
            <p>{p.title}</p>
            <p>ราคา: {p.price} บาท</p>
          </div>
        ))}
    </div>
  );
}

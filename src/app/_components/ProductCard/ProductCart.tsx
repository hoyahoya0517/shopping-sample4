"use client";

import Link from "next/link";
import stlyes from "./ProductCart.module.css";
import { ProductType } from "@/type/type";
import { useEffect, useState } from "react";

export default function ProductCard({ product }: { product: ProductType }) {
  const [onMouse, setOnMouse] = useState(false);
  const [isSoldout, setIsSoldout] = useState(true);
  useEffect(() => {
    if (!product.isVisible) return;
    product.stock.forEach((stock) => {
      console.log(stock.qty);
      if (stock.qty !== 0) setIsSoldout(false);
    });
  }, [product]);
  if (!product.isVisible) return null;
  return (
    <div className={stlyes.productCard}>
      <Link
        className={stlyes.image}
        href={`/collections/product/${product.id}`}
      >
        <img
          onMouseEnter={() => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIos =
              userAgent.indexOf("iphone") > -1 ||
              (userAgent.indexOf("ipad") > -1 && "ontouchend" in document);
            if (isIos) return;
            setOnMouse(true);
          }}
          onMouseLeave={() => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIos =
              userAgent.indexOf("iphone") > -1 ||
              (userAgent.indexOf("ipad") > -1 && "ontouchend" in document);
            if (isIos) return;
            setOnMouse(false);
          }}
          src={onMouse ? product.img[1] : product.img[0]}
        />
      </Link>
      <Link href={`/collections/product/${product.id}`}>{product.name}</Link>
      <div className={stlyes.bottom}>
        <p>{`₩${product.price}`}</p>
        <p className={`${isSoldout ? stlyes.soldOut : stlyes.notSoldOut}`}>
          Sold Out
        </p>
      </div>
    </div>
  );
}

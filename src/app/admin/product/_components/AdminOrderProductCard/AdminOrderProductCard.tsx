"use client";

import { CategoryType, ProductType } from "@/type/type";
import styles from "./AdminOrderProductCard.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";

import { getCategory } from "@/actions/category";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

dayjs.locale("ko");

export default function AdminOrderProductCard({
  orderProducts,
  setOrderProducts,
  product,
  index,
  last,
}: {
  orderProducts: ProductType[];
  setOrderProducts: Dispatch<SetStateAction<ProductType[]>>;
  product: ProductType;
  index: number;
  last: boolean;
}) {
  const [category, setCategory] = useState(product.category);

  const { data: categoryData } = useQuery<CategoryType>({
    queryKey: ["category"],
    queryFn: () => getCategory(),
  });

  useEffect(() => {
    if (!product) return;
    if (!categoryData) return;
    if (
      categoryData?.category.find((category) => {
        if (category === "new") return false;
        if (category === product.category) return true;
        return false;
      })
    )
      setCategory(product.category);
    else setCategory(categoryData.category[1]);
  }, [product, categoryData]);
  return (
    <div
      className={styles.adminProductcard}
      style={{
        borderBottom: last
          ? "none"
          : " border-bottom: 1px solid var(--gray-color)",
      }}
    >
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.name}>
            <span>{product.name}</span>
          </div>
          <div className={styles.topRight}>
            <div className={styles.category}>
              <span>{category}</span>
            </div>
            <div className={styles.createdAt}>
              {product?.createdAt
                ? dayjs(product.createdAt).format("YYYY.MM.DD HH:mm")
                : ""}
            </div>
            <div className={styles.price}>
              <span>{`₩${product.price}`}</span>
            </div>
          </div>
          <div className={styles.orderButtonContainer}>
            <div className={styles.orderButton}>
              <button
                disabled={index === 0}
                onClick={() => {
                  if (index === 0) return;
                  const newProducts = orderProducts.slice();
                  [newProducts[index - 1], newProducts[index]] = [
                    newProducts[index],
                    newProducts[index - 1],
                  ];
                  setOrderProducts(newProducts);
                }}
              >
                <BsCaretUpFill color="black" />
              </button>
            </div>
            <div className={styles.orderButton}>
              <button
                disabled={index === orderProducts.length - 1}
                onClick={() => {
                  if (index === orderProducts.length - 1) return;
                  const newProducts = orderProducts.slice();
                  [newProducts[index], newProducts[index + 1]] = [
                    newProducts[index + 1],
                    newProducts[index],
                  ];
                  setOrderProducts(newProducts);
                }}
              >
                <BsCaretDownFill color="black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

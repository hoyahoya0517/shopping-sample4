import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./AdminOrder.module.css";
import { ProductType } from "@/type/type";
import { getAdminAllProducts, updateAdminProductOrder } from "@/actions/admin";
import { useEffect, useState } from "react";
import AdminOrderProductCard from "../AdminOrderProductCard/AdminOrderProductCard";

export default function AdminOrder() {
  const [orderProducts, setOrderProducts] = useState<ProductType[]>([]);
  const [timeOut, setTimeOut] = useState<any>();
  const [isUpdate, setIsUpdate] = useState(false);
  const queryClient = useQueryClient();
  const updateProductOrderMutate = useMutation({
    mutationFn: async () => {
      if (!orderProducts) return;
      await updateAdminProductOrder(orderProducts);
    },
    onSuccess: () => {
      clearTimeout(timeOut);
      queryClient.invalidateQueries({ queryKey: ["admin", "collections"] });
      setIsUpdate(true);
      setTimeOut(
        setTimeout(() => {
          setIsUpdate(false);
        }, 500)
      );
    },
    onError: () => {
      alert("문제가 발생했습니다. 다시 시도하세요.");
    },
  });
  const { data: products } = useQuery<ProductType[]>({
    queryKey: ["admin", "collections", "products"],
    queryFn: () => getAdminAllProducts(),
  });
  useEffect(() => {
    if (!products) return;
    setOrderProducts(products);
  }, [products]);
  return (
    <div className={`${styles.adminOrder}`}>
      <div className={styles.addProductButton}>
        <button
          onClick={() => {
            updateProductOrderMutate.mutate();
          }}
        >
          상품 순서저장
        </button>
      </div>
      <div className={`${styles.main} ${isUpdate ? styles.isUpdate : ""}`}>
        <div className={styles.top}>
          <div className={styles.topName}>
            <span>상품명</span>
          </div>
          <div className={styles.topCategory}>
            <span>카테고리</span>
          </div>
          <div className={`${styles.topMenu} ${styles.topCreatedAt}`}>
            <span>등록일</span>
          </div>
          <div className={`${styles.topMenu} ${styles.topPrice}`}>
            <span>가격</span>
          </div>
          <div className={styles.topOrder}>
            <span>순서</span>
          </div>
        </div>
        <div className={styles.center}>
          {orderProducts?.map((product, index) => (
            <AdminOrderProductCard
              key={product.id}
              orderProducts={orderProducts}
              setOrderProducts={setOrderProducts}
              product={product}
              index={index}
              last={index === orderProducts.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

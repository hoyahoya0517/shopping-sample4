"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { OrderType, UserType } from "@/type/type";
import { getUserInfo } from "@/actions/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminAllOrder } from "@/actions/admin";
import Loading from "../_components/Loading/Loading";
import dayjs from "dayjs";

export default function Admin() {
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });
  const { data: orders } = useQuery<OrderType[]>({
    queryKey: ["admin", "order", "orders"],
    queryFn: () => getAdminAllOrder(),
  });
  const router = useRouter();
  const [salesToday, setSalesToday] = useState<number>(0);
  const [salesThisWeek, setSalesThisWeek] = useState<number>(0);
  const [salesThisMonth, setSalesThisMonth] = useState<number>(0);
  const [salesAll, setSalesAll] = useState<number>(0);
  const [returnToday, setReturnToday] = useState<number>(0);
  const [returnThisWeek, setReturnThisWeek] = useState<number>(0);
  const [returnThisMonth, setReturnThisMonth] = useState<number>(0);
  const [returnAll, setReturnAll] = useState<number>(0);
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const [setOrderChecking, setOrderCheckingsetOrderChecking] =
    useState<number>(0);
  const [shipmentPreparing, setShipmentPreparing] = useState<number>(0);
  const [shipmentComplete, setShipmentComplete] = useState<number>(0);
  const [returnOrdering, setReturnOrdering] = useState<number>(0);
  const [returnComplete, setReturnComplete] = useState<number>(0);

  useEffect(() => {
    if (isError) router.push("/");
    if (!isLoading) {
      if (userInfo?.isAdmin === true) setUserIsAdmin(true);
      else router.push("/");
    }
  }, [userInfo, isLoading, isError]);

  useEffect(() => {
    if (!orders) return;
    setOrderCheckingsetOrderChecking(0);
    setShipmentPreparing(0);
    setShipmentComplete(0);
    setReturnOrdering(0);
    setReturnComplete(0);
    orders.forEach((order) => {
      switch (order.orderStatus) {
        case "주문 확인 중":
          setOrderCheckingsetOrderChecking((prev) => prev + 1);
          break;
        case "발송 준비 중":
          setShipmentPreparing((prev) => prev + 1);
          break;
        case "발송 완료":
          setShipmentComplete((prev) => prev + 1);
          break;
        case "반품 진행 중":
          setReturnOrdering((prev) => prev + 1);
          break;
        case "반품 완료":
          setReturnComplete((prev) => prev + 1);
          break;
      }
    });
  }, [orders]);
  useEffect(() => {
    if (!orders) return;
    function getMonday(d: Date) {
      d = new Date(d);
      const day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    }
    const today = dayjs(new Date()).format("YYYY-MM-DD");
    const thisWeekMonday = dayjs(getMonday(new Date())).format("YYYY-MM-DD");
    const firstDay = dayjs(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ).format("YYYY-MM-DD");
    let tmpSalesToday = 0;
    let tmpSalesThisWeek = 0;
    let tmpSalesThisMonth = 0;
    let tmpSalesAll = 0;
    let tmpReturnToday = 0;
    let tmpReturnThisWeek = 0;
    let tmpReturnThisMonth = 0;
    let tmpReturnAll = 0;
    orders.map((order) => {
      tmpSalesAll += order.amount;
      const diffToday = dayjs(order.createdAt.split("T")[0]).diff(today, "day");
      const diffWeek = dayjs(order.createdAt.split("T")[0]).diff(
        thisWeekMonday,
        "week"
      );
      const diffMonth = dayjs(order.createdAt.split("T")[0]).diff(
        firstDay,
        "month"
      );
      if (diffToday === 0) tmpSalesToday += order.amount;
      if (diffWeek === 0) tmpSalesThisWeek += order.amount;
      if (diffMonth === 0) tmpSalesThisMonth += order.amount;

      if (order.cancels && order.cancels.length > 0) {
        order.cancels.forEach((cancel) => {
          tmpReturnAll += cancel.cancelAmount;
          const cancelDiffToday = dayjs(cancel.createdAt.split("T")[0]).diff(
            today,
            "day"
          );
          const cancelDiffWeek = dayjs(cancel.createdAt.split("T")[0]).diff(
            thisWeekMonday,
            "week"
          );
          const cancelDiffMonth = dayjs(cancel.createdAt.split("T")[0]).diff(
            firstDay,
            "month"
          );
          if (cancelDiffToday === 0) tmpReturnToday += cancel.cancelAmount;
          if (cancelDiffWeek === 0) tmpReturnThisWeek += cancel.cancelAmount;
          if (cancelDiffMonth === 0) tmpReturnThisMonth += cancel.cancelAmount;
        });
      }
    });
    setSalesToday(tmpSalesToday);
    setSalesThisWeek(tmpSalesThisWeek);
    setSalesThisMonth(tmpSalesThisMonth);
    setSalesAll(tmpSalesAll);
    setReturnToday(tmpReturnToday);
    setReturnThisWeek(tmpReturnThisWeek);
    setReturnThisMonth(tmpReturnThisMonth);
    setReturnAll(tmpReturnAll);
  }, [orders]);

  if (isLoading) return <Loading />;
  if (!userIsAdmin) return <div className={styles.admin}></div>;
  return (
    <div className={styles.admin}>
      <div className={styles.main}>
        <div
          className={styles.orderMenu}
          onClick={() => {
            router.push("/admin/order");
          }}
        >
          <div className={styles.orderMenuDetail}>
            <span style={{ color: "#e53e3e" }} className={styles.orderFont}>
              {setOrderChecking}
            </span>
            <span style={{ color: "#e53e3e" }}>주문 확인 중</span>
          </div>
          <div className={styles.orderMenuDetail}>
            <span className={styles.orderFont}>{shipmentPreparing}</span>
            <span>발송 준비 중</span>
          </div>
          <div className={styles.orderMenuDetail}>
            <span className={styles.orderFont}>{shipmentComplete}</span>
            <span>발송 완료</span>
          </div>
          <div className={styles.orderMenuDetail}>
            <span className={styles.orderFont}>{returnOrdering}</span>
            <span>반품 진행 중</span>
          </div>
          <div className={styles.orderMenuDetail}>
            <span className={styles.orderFont}>{returnComplete}</span>
            <span>반품 완료</span>
          </div>
        </div>
        <div className={styles.salesMenuList}>
          <div
            className={styles.salesMenu}
            onClick={() => {
              router.push("/admin/sales");
            }}
          >
            <div className={styles.salesMenuDetail}>
              <span className={styles.price}>{`₩${salesToday}`}</span>
              <span>오늘 결제</span>
            </div>
            <div className={`${styles.salesMenuDetail} ${styles.week}`}>
              <span className={styles.price}>{`₩${salesThisWeek}`}</span>
              <span>이번주 결제</span>
            </div>
            <div className={styles.salesMenuDetail}>
              <span className={styles.price}>{`₩${salesThisMonth}`}</span>
              <span>이번달 결제</span>
            </div>
            <div className={styles.salesMenuDetail}>
              <span className={styles.price}>{`₩${salesAll}`}</span>
              <span>전체 결제</span>
            </div>
          </div>
          <div
            className={styles.salesMenu}
            onClick={() => {
              router.push("/admin/sales");
            }}
          >
            <div className={styles.salesMenuDetail}>
              <span className={styles.price}>{`₩${returnToday}`}</span>
              <span>오늘 반품</span>
            </div>
            <div className={styles.salesMenuDetail}>
              <span className={styles.price}>{`₩${returnThisWeek}`}</span>
              <span>이번주 반품</span>
            </div>
            <div className={`${styles.salesMenuDetail} ${styles.week}`}>
              <span className={styles.price}>{`₩${returnThisMonth}`}</span>
              <span>이번달 반품</span>
            </div>
            <div className={styles.salesMenuDetail}>
              <span className={styles.price}>{`₩${returnAll}`}</span>
              <span>전체 반품</span>
            </div>
          </div>
          <div
            className={styles.salesMenu}
            onClick={() => {
              router.push("/admin/sales");
            }}
          >
            <div className={styles.salesMenuDetail}>
              <span className={styles.price}>{`₩${
                salesToday - returnToday
              }`}</span>
              <span>오늘 매출</span>
            </div>
            <div className={`${styles.salesMenuDetail} ${styles.week}`}>
              <span className={styles.price}>{`₩${
                salesThisWeek - returnThisWeek
              }`}</span>
              <span>이번주 매출</span>
            </div>
            <div className={styles.salesMenuDetail}>
              <span className={styles.price}>{`₩${
                salesThisMonth - returnThisMonth
              }`}</span>
              <span>이번달 매출</span>
            </div>
            <div className={styles.salesMenuDetail}>
              <span className={styles.price}>{`₩${salesAll - returnAll}`}</span>
              <span>전체 매출</span>
            </div>
          </div>
        </div>
        <div className={styles.normalMenu}>
          <Link href={"/admin/home"}>메인페이지 관리</Link>
        </div>
        <div className={styles.normalMenu}>
          <Link href={"/admin/category"}>카테고리 관리</Link>
        </div>
        <div className={styles.normalMenu}>
          <Link href={"/admin/product"}>상품 관리</Link>
        </div>
        <div className={styles.normalMenu}>
          <Link href={"/admin/auth"}>사용자 관리</Link>
        </div>
        <div className={styles.normalMenu}>
          {/* 브랜드 pg상점 관리 */}
          <a
            href={"https://admin.portone.io/payments"}
            target="_blank"
            style={{ color: "red" }}
          >
            PG상점관리자
          </a>
        </div>
        <div className={styles.normalMenu}>
          {/* 브랜드 이미지 관리 */}
          <a href={"https://console.cloudinary.com/console"} target="_blank">
            cloudinary (이미지 관리)
          </a>
        </div>
        <div className={styles.normalMenu}>
          {/* 브랜드 방문자 통계 */}
          <a href={"https://vercel.com/"} target="_blank">
            vercel (방문자 통계)
          </a>
        </div>
      </div>
    </div>
  );
}

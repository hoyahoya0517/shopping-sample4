"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "./page.module.css";
import { OrderType } from "@/type/type";
import { getAdminAllOrder } from "@/actions/admin";
import { useEffect, useState } from "react";
import Loading from "@/app/_components/Loading/Loading";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import ProductCard from "./_components/ProductCard/ProductCard";
import ReturnCard from "./_components/ReturnCard/ReturnCard";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export type RankingProduct = {
  id: string;
  name: string;
  img: string[];
  price: number;
  sales: number;
  size: string;
};

export type ReturnDetail = {
  orderId: string;
  img: string;
  amount: number;
  cancelResaon: string;
  cancelAmount: number;
};

export default function Sales() {
  const { data: orders, isLoading } = useQuery<OrderType[]>({
    queryKey: ["admin", "order", "all"],
    queryFn: () => getAdminAllOrder(),
  });
  const [value, onChange] = useState<Value>(new Date());
  const [salesToday, setSalesToday] = useState<number>(0);

  const [salesThisWeek, setSalesThisWeek] = useState<number>(0);
  const [salesThisMonth, setSalesThisMonth] = useState<number>(0);
  const [salesAll, setSalesAll] = useState<number>(0);
  const [returnToday, setReturnToday] = useState<number>(0);
  const [returnThisWeek, setReturnThisWeek] = useState<number>(0);
  const [returnThisMonth, setReturnThisMonth] = useState<number>(0);
  const [returnAll, setReturnAll] = useState<number>(0);
  const [salesCalendar, setSalesCalendar] = useState<number>(0);
  const [returnArray, setReturnArray] = useState<ReturnDetail[]>([]);
  const [rankingArray, setRankingArray] = useState<RankingProduct[]>([]);
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

  useEffect(() => {
    if (!orders) return;
    const calendarDay = dayjs(value?.toString()).format("YYYY-MM-DD");
    let tmpSalesCalendar = 0;
    orders.map((order) => {
      const diffCalendar = dayjs(order.createdAt.split("T")[0]).diff(
        calendarDay,
        "day"
      );
      if (diffCalendar === 0) tmpSalesCalendar += order.amount;
    });
    setSalesCalendar(tmpSalesCalendar);
  }, [value, orders]);

  useEffect(() => {
    if (!orders) return;
    const calendarDay = dayjs(value?.toString()).format("YYYY-MM-DD");
    const tmpRankingArray: RankingProduct[] = [];

    orders.forEach((order) => {
      if (order.createdAt.split("T")[0] !== calendarDay) return;
      order.cart.forEach((item) => {
        const findProductIndex = tmpRankingArray.findIndex(
          (product) =>
            product.name === item.name &&
            product.price === item.price &&
            JSON.stringify(product.img) === JSON.stringify(item.img) &&
            product.size === item.cartStock.stock.size
        );

        if (findProductIndex !== -1) {
          tmpRankingArray[findProductIndex].sales += item.cartStock.stock.qty;
        } else {
          tmpRankingArray.push({
            id: item.id,
            name: item.name,
            img: item.img,
            price: item.price,
            sales: item.cartStock.stock.qty,
            size: item.cartStock.stock.size,
          });
        }
      });
    });
    tmpRankingArray.sort((a, b) => b.sales - a.sales);
    setRankingArray(tmpRankingArray);
  }, [orders, value]);

  useEffect(() => {
    if (!orders) return;
    const calendarDay = dayjs(value?.toString()).format("YYYY-MM-DD");
    const tmpReturnArray: ReturnDetail[] = [];

    orders.forEach((order) => {
      if (!order.cancels || order.cancels.length === 0) return;

      order.cancels.forEach((cancel) => {
        if (cancel.createdAt.split("T")[0] !== calendarDay) return;
        tmpReturnArray.push({
          orderId: order.orderId,
          img: order.cart[0].img[0],
          amount: order.amount,
          cancelResaon: cancel.cancelReason,
          cancelAmount: cancel.cancelAmount,
        });
      });
    });

    setReturnArray(tmpReturnArray);
  }, [orders, value]);

  if (isLoading) return <Loading />;
  return (
    <div className={styles.sales}>
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.salesMenuList}>
            <div className={styles.salesMenu}>
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
            <div className={styles.salesMenu}>
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
            <div className={styles.salesMenu}>
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
                <span className={styles.price}>{`₩${
                  salesAll - returnAll
                }`}</span>
                <span>전체 매출</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.center}>
          <Calendar onChange={onChange} value={value} />
        </div>
        <div className={styles.bottom}>
          <div className={styles.ranking}>
            <div className={styles.rankingTop}>
              <div className={styles.rankingTopRanking}>판매순위</div>
              <div className={styles.day}>
                <span>
                  {dayjs(value?.toString()).format("YYYY년MM월DD일 결제")}
                </span>
                <span className={styles.dayAir}>&nbsp;</span>
                <span style={{ color: "red" }}>{`₩${salesCalendar}`}</span>
              </div>
              <div className={styles.rankingTopQty}>판매수</div>
            </div>
            <div className={styles.rankingMain}>
              {!rankingArray || rankingArray?.length === 0 ? (
                <span className={styles.rankingArrayNull}>
                  주문내역이 없습니다.
                </span>
              ) : (
                rankingArray.map((product, index) => (
                  <ProductCard
                    key={`${product.name}${index}`}
                    product={product}
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
          <div className={styles.returnRanking}>
            <div className={styles.rankingTop}>
              <div className={styles.day}>
                <span>
                  {dayjs(value?.toString()).format("YYYY년MM월DD일 반품")}
                </span>
                <span className={styles.dayAir}>&nbsp;</span>
                <span style={{ color: "red" }}>{`₩${salesCalendar}`}</span>
              </div>
            </div>
            <div className={styles.rankingMain}>
              {!returnArray || returnArray?.length === 0 ? (
                <span className={styles.rankingArrayNull}>
                  반품내역이 없습니다.
                </span>
              ) : (
                returnArray.map((cancelDetail, index) => (
                  <ReturnCard
                    cancelDetail={cancelDetail}
                    index={index}
                    key={`${cancelDetail.orderId}${index}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

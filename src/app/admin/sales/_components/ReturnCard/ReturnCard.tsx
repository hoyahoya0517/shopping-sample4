import { ReturnDetail } from "../../page";
import styles from "./ReturnCard.module.css";

export default function ReturnCard({
  cancelDetail,
  index,
}: {
  cancelDetail: ReturnDetail;
  index: number;
}) {
  return (
    <div className={styles.returnDetail}>
      <div className={styles.index}>
        <span>{index + 1}</span>
      </div>
      <div className={styles.product}>
        <div className={styles.image}>
          <img src={cancelDetail.img} />
        </div>
        <div className={styles.detail}>
          <span>{`주문 번호 : ${cancelDetail.orderId}`}</span>
          <span>{`결제 금액 : ${cancelDetail.amount}`}</span>
          <span>{`취소 금액 : ${cancelDetail.cancelAmount}`}</span>
          <span>{`취소 사유 : ${cancelDetail.cancelResaon}`}</span>
        </div>
      </div>
    </div>
  );
}

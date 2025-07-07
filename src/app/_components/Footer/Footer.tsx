"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (isOpen) window.scrollTo(0, 9999999);
  }, [isOpen]);
  return (
    <div className={styles.footer}>
      <motion.div
        className={styles.logo}
        initial={{
          bottom: "50%",
          right: "50%",
          transform: "translate(50%, 50%) scale(8)",
        }}
        animate={{
          bottom: "1%",
          right: "0",
          transform: "translate(0, 0) scale(1)",
        }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
      >
        <img
          onClick={() => {
            router.push("/");
          }}
          src="https://res.cloudinary.com/hoyahoya/image/upload/v1710141096/letter/logo/logo_144_sjjqqr.png"
        />
      </motion.div>
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.brandName}>
            <span
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
            >
              STAR SPRAY {/* 브랜드 이름 */}
            </span>
          </div>
          {/* 브랜드 이름 */}
          <div className={styles.topMenu}>
            <Link href="/legal">Legal</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/shippingAndReturns">Shipping and Returns</Link>
            <p>Instagram</p>
          </div>
        </div>
        {isOpen && (
          <div className={styles.bottom}>
            <p>
              법인명 : 스타스프레이 | 대표 : 이건호 | 이메일 :
              help.starspray@gmail.com | 전화 : 010-6272-6828
            </p>
            <p>
              사업자 등록번호 : 568-03-02882 | 통신판매업 신고 :
              2024-서울송파-0871 |{" "}
              <span
                className={styles.safePurchase}
                onClick={() => {
                  window.open(
                    "",
                    "KB_AUTHMARK",
                    "height=604, width=648, status=yes, toolbar=no, menubar=no,location=no"
                  );
                  const form = document.forms.namedItem("KB_AUTHMARK_FORM");
                  if (form instanceof HTMLFormElement) {
                    form.action = "https://okbfex.kbstar.com/quics";
                    form.target = "KB_AUTHMARK";
                    form.submit();
                  }
                }}
              >
                안전구매(에스크로)
              </span>
            </p>
            <p>
              주소 : 43, SONGPA-DAERO 28-GIL, SONGPA-GU, SEOUL, REPUBLIC OF
              KOREA
            </p>
            {/* 브랜드 이름 */}
            <form name="KB_AUTHMARK_FORM" method="get">
              <input type="hidden" name="page" value="C021590" />
              <input type="hidden" name="cc" value="b034066:b035526" />
              <input
                type="hidden"
                name="mHValue"
                value="b844d1bb91c80ab7cbc49bfbe146a8f7"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

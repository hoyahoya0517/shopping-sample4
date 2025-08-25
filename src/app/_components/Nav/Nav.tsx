"use client";

import Link from "next/link";
import styles from "./Nav.module.css";
import { AiOutlineMenu } from "react-icons/ai";
import {
  useCartIsChangeStore,
  useNavStore,
  useSearchStore,
} from "@/store/store";
import { useSession } from "next-auth/react";
// import { UserType } from "@/type/type";
// import { getUserInfo } from "@/actions/auth";
// import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { mainColor } from "@/app/_config/ColorSetting";
import { BsFillHeartFill } from "react-icons/bs";
import { motion, useAnimate } from "motion/react";
import { IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { RiShoppingBagLine } from "react-icons/ri";
import { MdOutlineStorefront } from "react-icons/md";

export default function Nav() {
  const [width, setWidth] = useState<number | undefined>();
  const { data: session } = useSession();
  // const { data: userInfo } = useQuery<UserType>({
  //   queryKey: ["account"],
  //   queryFn: () => getUserInfo(),
  // });
  const [scope, animate] = useAnimate();
  const { setNavOn } = useNavStore();
  const { setSearchOn } = useSearchStore();
  const { cartIsChange, setCartIsChange } = useCartIsChangeStore();
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const heartAnimation = async () => {
      await animate(
        scope.current,
        { opacity: 1, transform: "translate(-50%,-50%)" },
        { duration: 1 }
      );
      await animate(scope.current, { opacity: 0 }, { duration: 0.8 });
      await animate(
        scope.current,
        { transform: "translate(-50%,-200%)" },
        { duration: 0 }
      );
    };
    if (cartIsChange) {
      setCartIsChange(false);
      heartAnimation();
    }
  }, [cartIsChange]);
  return (
    <div className={styles.nav}>
      <div className={styles.main}>
        <div className={styles.leftMenu}>
          {width !== undefined ? (
            width > 768 ? (
              <Link href={"/"}>STAR SPRAY</Link> // 브랜드 이름
            ) : (
              <span
                onClick={() => {
                  setNavOn(true);
                }}
              >
                <AiOutlineMenu size={32} color={`${mainColor}`} />
              </span>
            )
          ) : (
            <></>
          )}
        </div>
        <div className={styles.rightMenu}>
          <Link href={"/collections/new?page=1"}>
            <MdOutlineStorefront size={53} color={`${mainColor}`} />
          </Link>
          <span
            onClick={() => {
              setSearchOn(true);
            }}
          >
            <IoSearch size={48} color={`${mainColor}`} />
          </span>
          {session?.user?.email ? (
            <Link href={"/account"}>
              <FaRegUser size={40} color={`${mainColor}`} />
            </Link>
          ) : (
            <Link href={"/account/login"}>
              <FaRegUser size={40} color={`${mainColor}`} />
            </Link>
          )}
          <div className={styles.cart}>
            <Link href={"/cart"}>
              {width !== undefined ? (
                width > 768 ? (
                  <RiShoppingBagLine size={47} color={`${mainColor}`} />
                ) : (
                  <RiShoppingBagLine size={32} color={`${mainColor}`} />
                )
              ) : (
                <></>
              )}
            </Link>
            {/* <Link href={"/cart"}>{`CART(${
              userInfo ? userInfo.cart.length : "0"
            })`}</Link> */}
            <motion.span
              ref={scope}
              className={styles.heart}
              initial={{ opacity: 0, transform: "translate(-50%,-300%)" }}
            >
              <BsFillHeartFill color="red" />
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}

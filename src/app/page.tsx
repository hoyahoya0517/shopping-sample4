import { getHomeWallpaper } from "@/actions/home";
import styles from "./page.module.css";
import HomeWallpaper from "./_components/HomeWallpaper/HomeWallpaper";

export default async function Home() {
  const homeWallpaper = await getHomeWallpaper();
  return (
    <div className={styles.home}>
      <div className={styles.top}>
        <HomeWallpaper homeWallpaper={homeWallpaper} />
      </div>
      {/* <div className={styles.bottom}>
        <div className={styles.bottomLeft}>
          <div className={styles.info}>
            <Link href={"/collections/new?page=1"}>New Arrivals</Link>
          </div>
          <img src="https://res.cloudinary.com/hoyahoya/image/upload/v1712298718/letter/%EC%9D%B4%EC%B9%B4%EB%A6%AC%EC%8B%A0%EC%A7%80%EB%A8%B8%EA%B7%B8%EC%BB%B5/5_dhu8ep.jpg" />
        </div>
        <div className={styles.bottomRight}>
          <div className={styles.info}>
            <Link href={"/collections/accessories?page=1"}>Accessories</Link>
          </div>
          <video
            className={styles.video}
            src={
              "https://res.cloudinary.com/hoyahoya/video/upload/v1708061295/letter/video22_vhm7v7.mp4"
            }
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div> */}
    </div>
  );
}

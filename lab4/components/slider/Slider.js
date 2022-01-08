import styles from "./slider.module.scss";
import Image from "next/image";
export default function Slider() {
  return (
    <>
      <input
        defaultChecked="checked"
        id={styles.tab1}
        type="radio"
        name="tabs"
      />
      <input id={styles.tab2} type="radio" name="tabs" />
      <input id={styles.tab3} type="radio" name="tabs" />
      <div className={styles.slider}>
        <div className={styles["to-left"]}>
          <label htmlFor={styles.tab1}>
            <Image
              src="/left.jpg"
              alt="first image"
              layout="fill"
              objectFit="fill"
            />
          </label>
          <label htmlFor={styles.tab2}>
            <Image
              src="/left.jpg"
              alt="first image"
              layout="fill"
              objectFit="fill"
            />
          </label>
          <label htmlFor={styles.tab3}>
            <Image
              src="/left.jpg"
              alt="first image"
              layout="fill"
              objectFit="fill"
            />
          </label>
        </div>
        <div className={styles["to-right"]}>
          <label htmlFor={styles.tab1}>
            <Image
              src="/right.jpg"
              alt="first image"
              layout="fill"
              objectFit="fill"
            />
          </label>
          <label htmlFor={styles.tab2}>
            <Image
              src="/right.jpg"
              alt="first image"
              layout="fill"
              objectFit="fill"
            />
          </label>
          <label htmlFor={styles.tab3}>
            <Image
              src="/right.jpg"
              alt="first image"
              layout="fill"
              objectFit="fill"
            />
          </label>
        </div>

        <div className={styles.dots}>
          <label htmlFor={styles.tab1}>
            <div className={styles.dot} data-name="tab1"></div>
          </label>
          <label htmlFor={styles.tab2}>
            <div className={styles.dot} data-name="tab2"></div>
          </label>
          <label htmlFor={styles.tab3}>
            <div className={styles.dot} data-name="tab3"></div>
          </label>
        </div>
        <section>
          <div className={styles.tab1}>
            <Image
              src="/first.jpg"
              alt="first image"
              layout="fill"
              objectFit="fill"
              priority="true"
            />
          </div>
          <div className={styles.tab2}>
            <Image
              src="/second.jpg"
              alt="first image"
              layout="fill"
              objectFit="fill"
              priority="true"
            />
          </div>
          <div className={styles.tab3}>
            <Image
              src="/third.jpg"
              alt="first image"
              layout="fill"
              objectFit="fill"
              priority="true"
            />
          </div>
        </section>
      </div>
    </>
  );
}

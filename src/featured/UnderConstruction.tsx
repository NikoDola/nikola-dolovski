import styles from "@/app/_styles/underconstruction.module.css";

export default function UnderConstruction() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.tag}>Coming Back Soon</div>
        <h1 className={styles.heading}>
          Website Under
          <br />
          Construction
        </h1>
        <p className={styles.sub}>
          Something great is being built here. Check back soon.
        </p>
        <div className={styles.divider} />
        <p className={styles.contact}>For work inquiries, contact me at</p>
        <a href="mailto:nikodola@gmail.com" className={styles.email}>
          nikodola@gmail.com
        </a>
      </div>
      <div className={styles.bar} />
    </section>
  );
}

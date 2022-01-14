import styles from "../styles/MailError.module.scss";

export default function MailError({ visibility }) {
  if (visibility) {
    return (
      <div className={styles.wrong} id="whereError">
        <img src="../emailError.png" alt="error" />
        Enter correct email!
      </div>
    );
  }
  return <></>;
}

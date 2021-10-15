import styles from "../styles/components.module.scss";

export default function MailError({ visibility }) {
  if (visibility === true) {
    return (
      <div className={styles.errorEmail} id="whereError">
        <img src="../emailError.png" alt="error" />
        Enter correct email!
      </div>
    );
  }
  return <></>;
}

import Head from "next/head";
import styles from "../styles/Home.module.scss";
import isEmail from "../src/checkEmail";
import { useState } from "react";
import Button from "../components/Button";
import MailError from "../components/mailEror";
import Messager from "../components/Messager";

export default function Home() {
  const [spinnerVisibility, setSpinnerVisibility] = useState(false);
  const [
    { mailErrorVisibilityFrom, mailErrorVisibilityWhere },
    setMailErrorVisibility,
  ] = useState({
    mailErrorVisibilityFrom: false,
    mailErrorVisibilityWhere: false,
  });
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  function setter() {
    setMessage("");
    setDisabled(false);
  }

  function prevent(e) {
    e.preventDefault();
    if (checkInfo(e.target.mailWhere.value, e.target.mailFrom.value)) {
      setSpinnerVisibility(true);
      const bodyToSend = {
        from: e.target.mailFrom.value,
        where: e.target.mailWhere.value,
        letter: e.target.letterValue.value,
      };
      fetch("/api/server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToSend),
      })
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          setMessage(data.message);
          setSpinnerVisibility(false);
          setDisabled(true);
          setTimeout(setter, 2000);
        })
        .catch((e) => {
          setSpinnerVisibility(false);
          setMessage("");
          setDisabled(false);
        });
    }
  }

  function checkInfo(mailWhere, mailFrom) {
    const where = isEmail(mailWhere);
    const from = isEmail(mailFrom);
    setMailErrorVisibility({
      mailErrorVisibilityFrom: !from,
      mailErrorVisibilityWhere: !where,
    });
    return where && from;
  }

  return (
    <>
      <Head>
        <title>Mailer</title>
        <link rel="shortcut icon" type="image/png" href="/mail.png" />
      </Head>
      <Messager message={message} />
      <form onSubmit={prevent}>
        <div className={styles.mainContent}>
          <div className={styles.sender}>Sender:</div>
          <div className={styles.mail}>
            <input
              type="text"
              name="mailFrom"
              placeholder="example@mail.com"
              required
            />
            <MailError visibility={mailErrorVisibilityFrom} />
          </div>
          <div className={styles.recipient}>Recipient:</div>
          <div className={styles.mail}>
            <input
              type="text"
              name="mailWhere"
              placeholder="example@mail.com"
              required
            />
            <MailError visibility={mailErrorVisibilityWhere} />
          </div>
          <textarea
            name="letterValue"
            placeholder="Text of the letter..."
            maxLength="1250"
            required
          ></textarea>
          <div className={styles.Button}>
            <Button visibility={spinnerVisibility} isDisabled={disabled} />
          </div>
        </div>
      </form>
    </>
  );
}

import Head from "next/head";
import styles from "../styles/Home.module.scss";
import isEmail from "../src/checkEmail";
import { useState } from "react";
import Button from "../components/Button";
import MailError from "../components/mailEror";
import Messager from "../components/Messager";

export default function Home() {
  const [spinnerVisibility, setSpinnerVisibility] = useState(false);
  const [mailErrorVisibility, setMailErrorVisibility] = useState(false);
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  function setter() {
    setMessage("");
    setDisabled(false);
  }

  function prevent(e) {
    e.preventDefault();
    if (checkInfo(e.target.mailWhere.value)) {
      setSpinnerVisibility(true);
      const bodyToSend = {
        from: e.target.mailFrom.value,
        where: e.target.mailWhere.value,
        letter: e.target.letterValue.value,
      };
      console.log(JSON.stringify(bodyToSend));
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

  function checkInfo(mailWhere) {
    const where = isEmail(mailWhere);
    if (where) {
      setMailErrorVisibility(false);
      return true;
    }
    setMailErrorVisibility(true);
    return false;
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
          <input
            type="text"
            name="mailFrom"
            value="lilly.nader5@ethereal.email"
            disabled
          />
          <div className={styles.recipient}>Recipient:</div>
          <div className={styles.where}>
            <input type="text" name="mailWhere" required />
            <MailError visibility={mailErrorVisibility} />
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

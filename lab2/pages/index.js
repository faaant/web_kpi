import Head from "next/head";
import styles from "../styles/Home.module.scss";
import isEmail from "../src/checkEmail";
import { useState } from "react";
import Button from "../components/Button";
import MailError from "../components/mailEror";
import Messager from "../components/Messager";

export default function Home() {
  const [spinnerVisibility, setSpinnerVisibility] = useState(false);
  const [{ mailErrorVisibility }, setMailErrorVisibility] = useState({
    mailErrorVisibility: false,
  });
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  function setter() {
    setMessage("");
    setDisabled(false);
  }

  function prevent(e) {
    e.preventDefault();
    if (checkInfo(e.target.Email.value)) {
      setSpinnerVisibility(true);
      const bodyToSend = {
        email: e.target.elements.Email?.value,
        letter: e.target.elements.letterValue?.value,
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
          setMessage(data.meta.data?.message ?? "An error may have occurred");
        })
        .catch((e) => {
          setMessage("Something went wrong!");
        })
        .finally(() => {
          setTimeout(setter, 2000);
          setSpinnerVisibility(false);
          setDisabled(true);
        });
    }
  }

  function checkInfo(Email) {
    const em = isEmail(Email);
    setMailErrorVisibility({
      mailErrorVisibility: !em,
    });
    return em;
  }

  return (
    <>
      <Head>
        <title>Mailer</title>
        <link rel="shortcut icon" type="image/png" href="/mail.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Messager message={message} />
      <form onSubmit={prevent}>
        <div className={styles.main}>
          <div className={styles.recipient}>Email:</div>
          <div className={styles.mail}>
            <input
              type="text"
              name="Email"
              placeholder="example@mail.com"
              required
            />
            <MailError visibility={mailErrorVisibility} />
          </div>
          <textarea
            name="letterValue"
            placeholder="Text of the letter..."
            maxLength="1250"
            required
          ></textarea>
          <div className={styles.button}>
            <Button visibility={spinnerVisibility} isDisabled={disabled} />
          </div>
        </div>
      </form>
    </>
  );
}

import Head from "next/head";
import styles from "../styles/Home.module.scss";
import isEmail from "../src/checkEmail";

export default function Home() {
  function prevent(e) {
    e.preventDefault();
    if (checkInfo()) {
      alert("Request sent");
      const form = document.querySelector("form");
      form.lastChild.firstChild.classList.add(styles.hidden);
      var spinner = document.createElement("img");
      spinner.src = "/Loader.gif";
      spinner.alt = "loader";
      form.lastChild.appendChild(spinner);

      const bodyToSend = {
        from: form.mailFrom.value,
        where: form.mailWhere.value,
        letter: form.letterValue.value,
      };
      fetch("/api/server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToSend),
      })
        .then((resp) => {
          if (resp.ok) {
            form.lastChild.firstChild.classList.remove(styles.hidden);
            form.lastChild.removeChild(form.lastChild.lastChild);
            alert("Mail sent!");
            document.location.reload();
          }
        })
        .catch((e) => console.log(e));
    }
  }

  function checkInfo() {
    const form = document.querySelector("form");
    const from = isEmail(form.mailFrom.value);
    const where = isEmail(form.mailWhere.value);
    if (from && where) {
      form.firstChild.firstChild.classList.remove(styles.visible);
      form.childNodes[1].firstChild.classList.remove(styles.visible);
      return true;
    } else {
      if (!from) {
        form.firstChild.firstChild.classList.add(styles.visible);
      } else {
        form.firstChild.firstChild.classList.remove(styles.visible);
      }

      var errWhere = document.getElementById("whereError");
      if (!where) {
        form.childNodes[1].firstChild.classList.add(styles.visible);
      } else {
        form.childNodes[1].firstChild.classList.remove(styles.visible);
      }

      return false;
    }
  }

  return (
    <>
      <Head>
        <title>Mailer</title>
        <link rel="shortcut icon" type="image/png" href="/mail.png" />
      </Head>
      <form onSubmit={prevent}>
        <div className={styles.centring}>
          <div className={styles.errorEmail} id="fromError">
            <img src="/emailError.png" alt="error" />
            Enter correct email!
          </div>
          <div className={styles.sender}>Sender:</div>
          <input
            type="text"
            name="mailFrom"
            value="lilly.nader5@ethereal.email"
            disabled
          />
        </div>
        <div className={styles.centring}>
          <div className={styles.errorEmail} id="whereError">
            <img src="/emailError.png" alt="error" />
            Enter correct email!
          </div>
          <div className={styles.recipient}>Recipient:</div>
          <input type="text" name="mailWhere" required />
        </div>
        <div className={styles.centring}>
          <textarea
            name="letterValue"
            placeholder="Text of the letter..."
            maxLength="1250"
            required
          ></textarea>
        </div>
        <div className={styles.left}>
          <input type="submit" value="Send" />
        </div>
      </form>
    </>
  );
}

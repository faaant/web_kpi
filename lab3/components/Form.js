import styles from "../styles/form.module.scss";
import Button from "./Button";
import { useState } from "react";
import Messager from "./Messager";
import { startExecuteMyMutation } from "../requests/mutation";

export default function Form({ close }) {
  let [spinnerVisibility, setSpinnerVisibility] = useState(false);
  let [message, setMessage] = useState("");
  let [disabled, setDisabled] = useState(false);

  function setter() {
    setMessage("");
    setDisabled(false);
  }

  function prevent(e) {
    e.preventDefault();
    setSpinnerVisibility(true);
    const bodyToSend = {
      theme: e.target.elements.Theme.value,
      post: e.target.elements.Post.value,
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
        if (data.meta.data?.message) {
          setMessage(data.meta.data.message);
          return;
        }

        const operationsDoc = `
          mutation MyMutation($post: String!, $theme: String!) {
            insert_Posts_one(object: {Post: $post, Theme: $theme}) {
              ID
            }
          }
        `;
        startExecuteMyMutation(operationsDoc, {
          post: data.meta.data.article.post,
          theme: data.meta.data.article.theme,
        })
          .then(() => {
            setMessage("Added!");
          })
          .catch(() => {
            setMessage("Error with request!");
          });
      })
      .catch(() => {
        setMessage("Error with adding info!");
      })
      .then(() => {
        setSpinnerVisibility(false);
        setDisabled(true);
        setTimeout(setter, 2000);
      });
  }

  return (
    <>
      <Messager message={message} />
      <div className={styles.main}>
        <form onSubmit={prevent}>
          <div className={styles.close} onClick={close}></div>
          <div className={styles.theme}>Theme:</div>
          <div className={styles["theme-inp"]}>
            <input type="text" name="Theme" placeholder="Autumn..." required />
          </div>
          <textarea
            name="Post"
            placeholder="Text of the post..."
            maxLength="500"
            required
          ></textarea>
          <div className={styles.button}>
            <Button visibility={spinnerVisibility} isDisabled={disabled} />
          </div>
        </form>
      </div>
    </>
  );
}

import styles from "../styles/form.module.scss";
import Button from "./Button";
import { useState } from "react";
import Messager from "./Messager";

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
      theme: e.target.Theme.value,
      post: e.target.Post.value,
    };
    fetch("/api/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToSend),
    })
      .then((resp) => {
        try {
          return resp.json();
        } catch (error) {
          return;
        }
      })
      .then((data) => {
        if (data.meta.data?.message && !data?.status) {
          setMessage(data.meta.data.message);
        } else {
          setSpinnerVisibility(false);
          setDisabled(true);
          if (data.meta.data?.message) {
            setMessage(data.meta.data.message);
          } else {
            setMessage("Something go wrong!");
          }
          return;
        }
        async function fetchGraphQL(operationsDoc, operationName, variables) {
          const result = await fetch(process.env.HEROKU, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: operationsDoc,
              variables: variables,
              operationName: operationName,
            }),
          }).catch((err) => {
            setSpinnerVisibility(false);
            setDisabled(true);
            setMessage("Error with request!");
          });

          try {
            return await result.json();
          } catch (error) {
            return error;
          }
        }

        const operationsDoc = `
            mutation MyMutation {
              insert_Posts_one(object: {Post: "${data.meta.data.article.post}", Theme: "${data.meta.data.article.theme}"}) {
                ID
              }
            }
          `;

        function executeMyMutation() {
          return fetchGraphQL(operationsDoc, "MyMutation", {});
        }

        async function startExecuteMyMutation() {
          const { errors, data } = await executeMyMutation();
        }
        startExecuteMyMutation();
        setSpinnerVisibility(false);
        setDisabled(true);
      })
      .catch(() => {
        setSpinnerVisibility(false);
        setDisabled(true);
        setMessage("Error with adding info!");
      });
    setTimeout(setter, 2000);
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

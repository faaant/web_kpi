export async function fetchGraphQL(operationsDoc, operationName, variables) {
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
  });
  return result.json();
}

export function executeMyMutation(operationsDoc) {
  return fetchGraphQL(operationsDoc, "MyMutation", {});
}

export async function startExecuteMyMutation(operationsDoc) {
  return executeMyMutation(operationsDoc);
}

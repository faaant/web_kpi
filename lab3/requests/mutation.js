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

export function executeMyMutation(operationsDoc, vars) {
  return fetchGraphQL(operationsDoc, "MyMutation", vars);
}

export async function startExecuteMyMutation(operationsDoc, vars) {
  return executeMyMutation(operationsDoc, vars);
}

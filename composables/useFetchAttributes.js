export async function useFetchAttributes(name, tree_id) {
  const { useFetchApi } = useApi();

  const { data, error } = await useFetchApi(`/api/${name}/get`, {
    method: "POST",
    body: JSON.stringify({ tree_id }),
  });

  if (error.value) throw new Error(error.value.message);
  return data.value;
}

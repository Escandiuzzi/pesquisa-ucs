export const queryString = (searchParams: URLSearchParams, key: string) => {
  const value = searchParams.get(key);
  return value !== undefined && value !== null && value !== ""
    ? value
    : undefined;
};

export const queryNumber = (searchParams: URLSearchParams, key: string) =>
  queryString(searchParams, key) !== undefined
    ? Number(queryString(searchParams, key))
    : undefined;

export const queryStringList = (searchParams: URLSearchParams, key: string) => {
  const value = searchParams.getAll(key);
  return value.length > 0 ? value : undefined;
};

export const queryNumberList = (searchParams: URLSearchParams, key: string) => {
  const value = queryStringList(searchParams, key);
  return value !== undefined ? value.map(Number) : undefined;
};

export const formString = (formData: FormData, key: string) => {
  const value = formData.get(key) as string | null;
  return value !== null && value !== "" ? value : undefined;
};

export const formNumber = (formData: FormData, key: string) =>
  formString(formData, key) !== undefined
    ? Number(formString(formData, key))
    : undefined;

export const formFile = (formData: FormData, key: string) => {
  const value = formData.get(key) as File | null;
  return value !== null && value.size !== 0 ? value : undefined;
};

export const formDate = (formData: FormData, key: string) => {
  const value = formString(formData, key)?.split("-").map(Number);
  return value !== undefined
    ? new Date(value[0], value[1] - 1, value[2])
    : undefined;
};

export const formStringList = (formData: FormData, key: string) => {
  const value = formData.getAll(key);
  return value.length > 0 ? value : undefined;
};

export const formNumberList = (formData: FormData, key: string) => {
  const value = formStringList(formData, key);
  return value !== undefined ? value.map(Number) : undefined;
};

export const stringToDate = (dateString?: string | null) => {
  if (!dateString) {
    return undefined;
  }
  const date = dateString.split("-").map(Number);
  return new Date(date[0], date[1] - 1, date[2]);
};

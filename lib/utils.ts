export const addParams = (
  ref: string,
  params: Record<string, string>,
): string => {
  const url = new URL(ref, window.location.origin);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );
  return url.pathname + url.search;
};

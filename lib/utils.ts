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
export const isValidNumber = (s: string): boolean =>
  s.trim() !== "" && Number.isFinite(Number(s));

export const REGISTRATION_REGEX =
  /^(?:N[1-9][0-9A-HJ-NP-Z]{0,4}|[0-9A-Z]{1,2}-[0-9A-Z]{2,5})$/i;

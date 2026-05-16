const rawBaseUrl = process.env.REACT_APP_BASE_URL || "";
const normalizedBaseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;

export const base_url = normalizedBaseUrl.endsWith("/api/")
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}api/`;

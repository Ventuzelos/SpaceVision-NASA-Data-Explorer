export default function isSafeUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

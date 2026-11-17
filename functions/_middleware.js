// Canonicalize the two production aliases only. Branch and commit previews
// (anything.depotmotorworks.pages.dev) and every other host pass through so
// the existing _redirects rules still run.
const CANONICAL_ORIGIN = "https://thedepotmotorworks.com";
const REDIRECT_HOSTS = new Set([
  "www.thedepotmotorworks.com",
  "depotmotorworks.pages.dev",
]);

function requestHost(request) {
  const header = request.headers.get("host");
  const raw = header && header.trim() ? header : new URL(request.url).host;
  return raw.split(",")[0].trim().replace(/:\d+$/, "").toLowerCase();
}

export async function onRequest(context) {
  const host = requestHost(context.request);
  if (!REDIRECT_HOSTS.has(host)) {
    return context.next();
  }

  const url = new URL(context.request.url);
  const target = new URL(url.pathname + url.search, CANONICAL_ORIGIN);
  return Response.redirect(target.toString(), 301);
}

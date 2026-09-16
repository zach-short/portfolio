/** The two shapes every endpoint here answers in, so no route hand-rolls a header set. */

export function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

/**
 * A stored profile never changes — `putProfile` writes each id once and nothing updates it — so
 * it is served immutable. The body is passed through verbatim rather than re-serialised.
 */
export function immutableJson(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
}

/** JSON that came off the wire: a syntax error is a 400, not a 500. */
export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

import { getCfg } from '../config/env';
import { AuthRes, TokCache } from '../types/log';
import { TIMEOUT_MS } from '../constants/vals';

let cache: TokCache | null = null;

async function fetchWithTimeout(url: string, opts: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function getTok(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cache && cache.expAt > now + 60) {
    return cache.tok;
  }

  const cfg = getCfg();
  const url = `${cfg.apiBase}/auth`;

  const body = JSON.stringify({
    email: cfg.email,
    name: cfg.name,
    rollNo: cfg.rollNo,
    accessCode: cfg.accessCode,
    clientID: cfg.clientID,
    clientSecret: cfg.clientSecret
  });

  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });

  if (!res.ok) {
    throw new Error(`Auth failed: ${res.status} ${res.statusText}`);
  }

  const data: AuthRes = await res.json();

  cache = {
    tok: data.access_token,
    expAt: data.expires_in
  };

  return cache.tok;
}

export function clearTokCache(): void {
  cache = null;
}

import { getCfg } from '../config/env';

type Stack = 'backend' | 'frontend';
type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type Pkg = 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' |
  'repository' | 'route' | 'service' | 'auth' | 'config' | 'middleware' | 'utils';

interface TokCache { tok: string; expAt: number; }

let cache: TokCache | null = null;

const TIMEOUT = 5000;
const RETRIES = 3;

async function getTok(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cache && cache.expAt > now + 60) return cache.tok;

  const cfg = getCfg();
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), TIMEOUT);

  try {
    const res = await fetch(`${cfg.apiBase}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cfg.email,
        name: cfg.name,
        rollNo: cfg.rollNo,
        accessCode: cfg.accessCode,
        clientID: cfg.clientID,
        clientSecret: cfg.clientSecret
      }),
      signal: ctrl.signal
    });

    if (!res.ok) throw new Error(`Auth: ${res.status}`);
    const data = await res.json();
    cache = { tok: data.access_token, expAt: data.expires_in };
    return cache.tok;
  } finally {
    clearTimeout(id);
  }
}

export async function Log(stk: Stack, lvl: Level, pkg: Pkg, msg: string): Promise<void> {
  try {
    const cfg = getCfg();

    for (let i = 0; i < RETRIES; i++) {
      try {
        const tok = await getTok();
        const ctrl = new AbortController();
        const id = setTimeout(() => ctrl.abort(), TIMEOUT);

        const res = await fetch(`${cfg.apiBase}/logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tok}`
          },
          body: JSON.stringify({ stack: stk, level: lvl, package: pkg, message: msg }),
          signal: ctrl.signal
        });

        clearTimeout(id);
        if (res.ok) return;
        if (res.status < 500) return;
      } catch {
        if (i === RETRIES - 1) return;
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
  } catch {
    // graceful failure
  }
}

export function LogSync(stk: Stack, lvl: Level, pkg: Pkg, msg: string): void {
  Log(stk, lvl, pkg, msg).catch(() => {});
}

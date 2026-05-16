import { getCfg } from '../config/env';
import { getTok } from './authSvc';
import { LogReq, LogRes, Stack, Level, Pkg } from '../types/log';
import {
  STACKS, LEVELS, BE_VALID_PKGS, FE_VALID_PKGS,
  TIMEOUT_MS, MAX_RETRIES, RETRY_DELAY_MS
} from '../constants/vals';

function validate(stk: string, lvl: string, pkg: string): string | null {
  if (!STACKS.includes(stk as Stack)) {
    return `Invalid stack: "${stk}". Must be: ${STACKS.join(', ')}`;
  }

  if (!LEVELS.includes(lvl as Level)) {
    return `Invalid level: "${lvl}". Must be: ${LEVELS.join(', ')}`;
  }

  const validPkgs = stk === 'backend' ? BE_VALID_PKGS : FE_VALID_PKGS;
  if (!validPkgs.includes(pkg as any)) {
    return `Invalid package: "${pkg}" for stack "${stk}". Must be: ${validPkgs.join(', ')}`;
  }

  return null;
}

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

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export async function sendLog(
  stk: string,
  lvl: string,
  pkg: string,
  msg: string
): Promise<LogRes | null> {
  const err = validate(stk, lvl, pkg);
  if (err) {
    console.error(`[LogSvc] Validation error: ${err}`);
    return null;
  }

  const cfg = getCfg();
  const url = `${cfg.apiBase}/logs`;

  const body: LogReq = {
    stack: stk as Stack,
    level: lvl as Level,
    package: pkg as Pkg,
    message: msg
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const tok = await getTok();

      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tok}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data: LogRes = await res.json();
        return data;
      }

      if (res.status >= 500 && attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      console.error(`[LogSvc] Log failed: ${res.status} ${res.statusText}`);
      return null;

    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.error(`[LogSvc] Timeout on attempt ${attempt}/${MAX_RETRIES}`);
      } else {
        console.error(`[LogSvc] Error on attempt ${attempt}/${MAX_RETRIES}: ${e.message}`);
      }

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      return null;
    }
  }

  return null;
}

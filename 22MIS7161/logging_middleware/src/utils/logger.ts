import { sendLog } from '../services/logSvc';
import { LogRes } from '../types/log';

export async function Log(
  stk: string,
  lvl: string,
  pkg: string,
  msg: string
): Promise<LogRes | null> {
  try {
    return await sendLog(stk, lvl, pkg, msg);
  } catch (e: any) {
    console.error(`[Log] Unhandled error: ${e.message}`);
    return null;
  }
}

export function LogSync(
  stk: string,
  lvl: string,
  pkg: string,
  msg: string
): void {
  Log(stk, lvl, pkg, msg).catch(() => {});
}

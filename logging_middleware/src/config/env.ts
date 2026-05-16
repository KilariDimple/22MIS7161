import * as fs from 'fs';
import * as path from 'path';

interface Cfg {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
  apiBase: string;
}

let cfg: Cfg | null = null;

function loadEnv(): void {
  const envPath = path.resolve(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    process.env[key] = val;
  }
}

export function getCfg(): Cfg {
  if (cfg) return cfg;

  loadEnv();

  cfg = {
    email: process.env.EMAIL || '',
    name: process.env.NAME || '',
    rollNo: process.env.ROLL_NO || '',
    accessCode: process.env.ACCESS_CODE || '',
    clientID: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    apiBase: process.env.API_BASE || 'http://4.224.186.213/evaluation-service'
  };

  return cfg;
}

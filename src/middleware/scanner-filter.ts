import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ScannerFilterConfig } from '../config.js';

const DEFAULT_SCANNER_UA = [
  'leakix',
  'l9scan',
  'l9explore',
  'zgrab',
  'masscan',
  'censys',
  'shodan',
  'nuclei',
  'httpx',
  'gobuster',
  'nikto',
  'nmap',
  'sqlmap',
];

const DEFAULT_SCANNER_PATHS = [
  '/trace.axd',
  '/@vite/env',
  '/.vscode/',
  '/.env',
  '/wp-admin',
  '/wp-login',
  '/phpinfo',
  '/actuator',
  '/v3/api-docs',
  '/api-docs/swagger',
];

export function isScannerRequest(
  request: FastifyRequest,
  options?: ScannerFilterConfig
): boolean {
  const ua = (request.headers['user-agent'] as string) || '';
  const path = request.url.split('?')[0] ?? '';

  const uaList = [...DEFAULT_SCANNER_UA, ...(options?.additionalUAs ?? [])];
  const pathList = [...DEFAULT_SCANNER_PATHS, ...(options?.additionalPaths ?? [])];

  const match =
    uaList.some((s) => ua.toLowerCase().includes(s)) ||
    pathList.some((p) => path.startsWith(p));

  if (match && options?.onScannerDetected) {
    try {
      options.onScannerDetected(ua, path);
    } catch {
      // ignore callback errors
    }
  }

  return match;
}

export function createScannerFilter(options?: ScannerFilterConfig) {
  return async function scannerFilter(request: FastifyRequest, _reply: FastifyReply) {
    (request as FastifyRequest & { isScanner?: boolean }).isScanner = isScannerRequest(
      request,
      options
    );
  };
}

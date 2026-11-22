export type AnalyticsParamValue = string | number | boolean;
export type AnalyticsEventParams = Record<string, AnalyticsParamValue>;

export interface AnalyticsEventDetail {
  name: string;
  params?: AnalyticsEventParams;
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim());
}

export function trackEvent(
  eventName: string,
  params?: AnalyticsEventParams
): boolean {
  if (typeof window === 'undefined' || !isAnalyticsEnabled()) {
    return false;
  }

  const normalizedName = eventName.trim();
  if (!normalizedName) {
    return false;
  }

  try {
    // shortcut: Cloudflare beacon.min.js tracks pageviews/RUM only (no custom-event API), upgrade if pairing with an event-capable endpoint
    if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(
        new CustomEvent<AnalyticsEventDetail>('portfolio:analytics', {
          detail: { name: normalizedName, params },
        })
      );
    }
    return true;
  } catch {
    // Analytics must never interrupt user interaction when blocked or unsupported
    return false;
  }
}

export function trackDownloadCV(source = 'modal'): boolean {
  return trackEvent('cv_download_click', { source });
}

export function trackExternalLink(
  url: string,
  label?: string,
  location?: string
): boolean {
  const normalizedUrl = url.trim();
  if (!normalizedUrl) {
    return false;
  }

  const params: AnalyticsEventParams = { url: normalizedUrl };
  if (label) params.label = label;
  if (location) params.location = location;

  return trackEvent('external_link_click', params);
}

export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path.startsWith('/')) return path;
  return `${base}${path}`;
}


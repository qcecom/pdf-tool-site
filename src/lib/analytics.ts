export function track(event: string, props?: Record<string, any>) {
  try {
    console.log('track', event, props);
    if (typeof window !== 'undefined') {
      (window as any).gtag?.('event', event, props);
    }
  } catch (err) {
    console.warn('analytics error', err);
  }
}

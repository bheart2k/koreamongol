import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;

let analyticsDataClient = null;

export function getAnalyticsClient() {
  if (!analyticsDataClient) {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';

    // Vercel/로컬 환경 모두 대응: \\n -> \n, 이미 실제 줄바꿈이면 그대로
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (!clientEmail || !privateKey) {
      throw new Error('Google Analytics credentials not configured');
    }

    analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }
  return analyticsDataClient;
}

export function getDateRange(period) {
  let startDate, endDate = 'today';
  switch (period) {
    case 'today':
      startDate = 'today';
      break;
    case 'yesterday':
      startDate = 'yesterday';
      endDate = 'yesterday';
      break;
    case '7days':
      startDate = '7daysAgo';
      break;
    case '30days':
      startDate = '30daysAgo';
      break;
    default:
      startDate = '7daysAgo';
  }
  return { startDate, endDate };
}

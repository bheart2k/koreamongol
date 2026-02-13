import { auth, isAdmin } from '@/lib/auth';
import { getAnalyticsClient, getDateRange, GA_PROPERTY_ID } from '@/lib/google-analytics';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user || !isAdmin(session)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7days';
    const { startDate, endDate } = getDateRange(period);

    const client = getAnalyticsClient();

    const [
      channelReport,
      sourceMediumReport,
      landingPageReport,
      referrerReport,
    ] = await Promise.all([
      // 채널별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'engagementRate' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),
      // 소스/매체
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [
          { name: 'sessionSource' },
          { name: 'sessionMedium' },
        ],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 15,
      }),
      // 랜딩 페이지
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'landingPage' }],
        metrics: [{ name: 'sessions' }, { name: 'bounceRate' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 15,
      }),
      // 참조 사이트 (Referral만)
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        dimensionFilter: {
          filter: {
            fieldName: 'sessionMedium',
            stringFilter: {
              matchType: 'EXACT',
              value: 'referral',
            },
          },
        },
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),
    ]);

    // 채널별
    const channels = (channelReport[0]?.rows || []).map(row => ({
      channel: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
      users: parseInt(row.metricValues[1].value),
      engagementRate: parseFloat(row.metricValues[2].value),
    }));

    // 소스/매체
    const sourceMedium = (sourceMediumReport[0]?.rows || []).map(row => ({
      source: row.dimensionValues[0].value,
      medium: row.dimensionValues[1].value,
      sessions: parseInt(row.metricValues[0].value),
      users: parseInt(row.metricValues[1].value),
    }));

    // 랜딩 페이지
    const landingPages = (landingPageReport[0]?.rows || []).map(row => ({
      path: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
      bounceRate: parseFloat(row.metricValues[1].value),
    }));

    // 참조 사이트
    const referrers = (referrerReport[0]?.rows || []).map(row => ({
      referrer: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
    }));

    return Response.json({
      channels,
      sourceMedium,
      landingPages,
      referrers,
    });
  } catch (error) {
    console.error('Acquisition Analytics Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch acquisition analytics' },
      { status: 500 }
    );
  }
}

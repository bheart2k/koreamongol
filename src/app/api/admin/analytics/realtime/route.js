import { auth, isAdmin } from '@/lib/auth';
import { getAnalyticsClient, GA_PROPERTY_ID } from '@/lib/google-analytics';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !isAdmin(session)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getAnalyticsClient();

    // 실시간 리포트
    const [realtimeReport] = await client.runRealtimeReport({
      property: `properties/${GA_PROPERTY_ID}`,
      metrics: [{ name: 'activeUsers' }],
    });

    // 실시간 페이지별
    const [realtimePageReport] = await client.runRealtimeReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dimensions: [{ name: 'unifiedScreenName' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 5,
    });

    const activeUsers = parseInt(realtimeReport?.rows?.[0]?.metricValues?.[0]?.value || 0);
    const pages = (realtimePageReport?.rows || []).map(row => ({
      page: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }));

    return Response.json({
      activeUsers,
      pages,
    });
  } catch (error) {
    console.error('Realtime Analytics Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch realtime data' },
      { status: 500 }
    );
  }
}

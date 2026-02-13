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
      overviewReport,
      pageMetricsReport,
      eventsReport,
      landingPagesReport,
    ] = await Promise.all([
      // 전체 개요
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'engagementRate' },
          { name: 'screenPageViewsPerSession' },
        ],
      }),
      // 페이지별 상세 메트릭
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 20,
      }),
      // 이벤트별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 15,
      }),
      // 랜딩 페이지별 세션
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'landingPagePlusQueryString' }],
        metrics: [{ name: 'sessions' }, { name: 'bounceRate' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),
    ]);

    // 개요 파싱
    const overviewRow = overviewReport[0]?.rows?.[0]?.metricValues || [];
    const avgEngagementTime = parseFloat(overviewRow[0]?.value || 0);
    const bounceRate = parseFloat(overviewRow[1]?.value || 0);
    const engagementRate = parseFloat(overviewRow[2]?.value || 0);
    const pagesPerSession = parseFloat(overviewRow[3]?.value || 0);

    // 페이지별 메트릭
    const pageMetrics = (pageMetricsReport[0]?.rows || []).map(row => ({
      path: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
      avgTime: parseFloat(row.metricValues[1].value),
      bounceRate: parseFloat(row.metricValues[2].value),
    }));

    // 이탈률 높은 페이지 (조회수 10 이상 중에서)
    const highBouncePages = pageMetrics
      .filter(p => p.views >= 10)
      .sort((a, b) => b.bounceRate - a.bounceRate)
      .slice(0, 10);

    // 이벤트
    const events = (eventsReport[0]?.rows || []).map(row => ({
      name: row.dimensionValues[0].value,
      count: parseInt(row.metricValues[0].value),
    }));

    // 랜딩 페이지
    const landingPages = (landingPagesReport[0]?.rows || []).map(row => ({
      path: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
      bounceRate: parseFloat(row.metricValues[1].value),
    }));

    return Response.json({
      avgEngagementTime,
      bounceRate,
      engagementRate,
      pagesPerSession,
      pageMetrics,
      highBouncePages,
      events,
      landingPages,
    });
  } catch (error) {
    console.error('Behavior Analytics Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch behavior analytics' },
      { status: 500 }
    );
  }
}

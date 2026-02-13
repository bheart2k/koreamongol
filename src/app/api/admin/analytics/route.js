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

    // 병렬로 여러 리포트 요청
    const [
      overviewReport,
      pageReport,
      sourceReport,
      countryReport,
      deviceReport,
      dailyReport,
    ] = await Promise.all([
      // 개요 (총 방문자, 페이지뷰, 세션)
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      }),
      // 인기 페이지
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      // 유입 경로
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),
      // 국가별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10,
      }),
      // 기기별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      }),
      // 일별 추이 (차트용)
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
      }),
    ]);

    // 데이터 변환
    const overview = overviewReport[0]?.rows?.[0]?.metricValues || [];
    const pages = (pageReport[0]?.rows || []).map(row => ({
      path: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
    }));
    const sources = (sourceReport[0]?.rows || []).map(row => ({
      source: row.dimensionValues[0].value,
      medium: row.dimensionValues[1].value,
      sessions: parseInt(row.metricValues[0].value),
    }));
    const countries = (countryReport[0]?.rows || []).map(row => ({
      country: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }));
    const devices = (deviceReport[0]?.rows || []).map(row => ({
      device: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }));
    const daily = (dailyReport[0]?.rows || []).map(row => ({
      date: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
      pageviews: parseInt(row.metricValues[1].value),
    }));

    return Response.json(
      {
        overview: {
          activeUsers: parseInt(overview[0]?.value || 0),
          pageViews: parseInt(overview[1]?.value || 0),
          sessions: parseInt(overview[2]?.value || 0),
          avgSessionDuration: parseFloat(overview[3]?.value || 0),
          bounceRate: parseFloat(overview[4]?.value || 0),
        },
        pages,
        sources,
        countries,
        devices,
        daily,
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=300', // 5분 캐싱
        },
      }
    );
  } catch (error) {
    console.error('Analytics API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

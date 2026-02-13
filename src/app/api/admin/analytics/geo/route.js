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
      countryReport,
      cityReport,
      koreanCityReport,
    ] = await Promise.all([
      // 국가별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'engagementRate' },
        ],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 20,
      }),
      // 도시별 (전 세계)
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [
          { name: 'city' },
          { name: 'country' },
        ],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 20,
      }),
      // 한국 도시별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'city' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        dimensionFilter: {
          filter: {
            fieldName: 'country',
            stringFilter: {
              matchType: 'EXACT',
              value: 'South Korea',
            },
          },
        },
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 20,
      }),
    ]);

    // 국가별
    const countries = (countryReport[0]?.rows || []).map(row => ({
      country: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
      sessions: parseInt(row.metricValues[1].value),
      engagementRate: parseFloat(row.metricValues[2].value),
    }));

    // 도시별 (전 세계)
    const cities = (cityReport[0]?.rows || [])
      .filter(row => row.dimensionValues[0].value !== '(not set)')
      .map(row => ({
        city: row.dimensionValues[0].value,
        country: row.dimensionValues[1].value,
        users: parseInt(row.metricValues[0].value),
      }));

    // 한국 도시별
    const koreanCities = (koreanCityReport[0]?.rows || [])
      .filter(row => row.dimensionValues[0].value !== '(not set)')
      .map(row => ({
        city: row.dimensionValues[0].value,
        users: parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
      }));

    return Response.json({
      countries,
      cities,
      koreanCities,
    });
  } catch (error) {
    console.error('Geo Analytics Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch geo analytics' },
      { status: 500 }
    );
  }
}

import { auth, isAdmin } from '@/lib/auth';
import { getAnalyticsClient, getDateRange, GA_PROPERTY_ID } from '@/lib/google-analytics';

const LANGUAGE_NAMES = {
  'ko': '한국어',
  'ko-kr': '한국어',
  'en': '영어',
  'en-us': '영어 (미국)',
  'en-gb': '영어 (영국)',
  'ja': '일본어',
  'ja-jp': '일본어',
  'zh': '중국어',
  'zh-cn': '중국어 (간체)',
  'zh-tw': '중국어 (번체)',
  'es': '스페인어',
  'fr': '프랑스어',
  'de': '독일어',
  'pt': '포르투갈어',
  'ru': '러시아어',
  'vi': '베트남어',
  'th': '태국어',
  'id': '인도네시아어',
};

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
      userTypeReport,
      languageReport,
      ageReport,
      genderReport,
      browserReport,
    ] = await Promise.all([
      // 신규 vs 재방문
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'newVsReturning' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViewsPerSession' },
        ],
      }),
      // 언어별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'language' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10,
      }),
      // 연령대별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'userAgeBracket' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      }),
      // 성별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'userGender' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      }),
      // 브라우저별
      client.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'browser' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10,
      }),
    ]);

    // 신규 vs 재방문 파싱
    let newUsers = 0, returningUsers = 0, totalUsers = 0, pagesPerSession = 0;
    (userTypeReport[0]?.rows || []).forEach(row => {
      const type = row.dimensionValues[0].value;
      const users = parseInt(row.metricValues[0].value);
      const pps = parseFloat(row.metricValues[2].value);
      if (type === 'new') {
        newUsers = users;
      } else if (type === 'returning') {
        returningUsers = users;
      }
      totalUsers += users;
      pagesPerSession = pps;
    });

    const languages = (languageReport[0]?.rows || []).map(row => {
      const lang = row.dimensionValues[0].value.toLowerCase();
      return {
        language: row.dimensionValues[0].value,
        languageName: LANGUAGE_NAMES[lang] || row.dimensionValues[0].value,
        users: parseInt(row.metricValues[0].value),
      };
    });

    const ageGroups = (ageReport[0]?.rows || []).map(row => ({
      age: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }));

    const genders = (genderReport[0]?.rows || []).map(row => ({
      gender: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }));

    const browsers = (browserReport[0]?.rows || []).map(row => ({
      browser: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }));

    return Response.json({
      totalUsers,
      newUsers,
      returningUsers,
      newUsersPercent: totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0,
      returningUsersPercent: totalUsers > 0 ? (returningUsers / totalUsers) * 100 : 0,
      pagesPerSession,
      languages,
      ageGroups,
      genders,
      browsers,
    });
  } catch (error) {
    console.error('Users Analytics Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch users analytics' },
      { status: 500 }
    );
  }
}

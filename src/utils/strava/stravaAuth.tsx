// This should be done on the backend, but for now it's here

const STRAVA_BASE_URL = 'https://www.strava.com'

const getAccessToken = async (clientId: string, clientSecret: string, code: string) => {
  const url = `${STRAVA_BASE_URL}/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`;
  const fetchResult = await fetch(url, { method: 'POST' });

  const json = await fetchResult.json();

  return json.access_token;
}

export { getAccessToken };
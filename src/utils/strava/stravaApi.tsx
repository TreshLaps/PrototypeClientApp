import { SummaryActivity, ActivityType, WorkoutType } from './types';
const STRAVA_API_BASE_URL: string = 'https://www.strava.com/api/v3'

const ACTIVITIES_PER_PAGE = 200;

const stravaFetch = async (url: string, accessToken: string, abortSignal?: AbortSignal) => {
  const uri = `${STRAVA_API_BASE_URL}/${url}`;

  const fetchResponse = await fetch(uri, {
    signal: abortSignal,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return await fetchResponse.json();
}

const getActivitiesAsync = async (accessToken: string, abortSignal: AbortSignal, before: Date, after: Date,
  callback: (allActivities: Array<any>, nextPage: number, loadedCount: number) => void) => {

  getActivitiesInternalAsync(accessToken, abortSignal, 1, [], before, after, callback);
}

const getActivitiesInternalAsync = async (accessToken: string, abortSignal: AbortSignal, nextPage = 1, all: Array<any>, before: Date, after: Date,
  callback: (allActivities: Array<any>, nextPage: number, loadedCount: number) => void) => {

  const beforeTime = before.getTime() / 1000;
  const afterTime = after.getTime() / 1000;

  const uri = `athlete/activities?before=${beforeTime}&after=${afterTime}&per_page=${ACTIVITIES_PER_PAGE}&page=${nextPage}`;

  try {
    const json = await stravaFetch(uri, accessToken, abortSignal);

    const newRuns = json.filter((a: SummaryActivity) => a.type === ActivityType.Run);
    const newActivities = newRuns.filter((a: SummaryActivity) => a.workout_type === WorkoutType.Workout);

    const allActivities = all.concat(newActivities);
    callback(allActivities, nextPage + 1, newRuns.length);

    if (json.length > 0) {
      await getActivitiesInternalAsync(accessToken, abortSignal, nextPage + 1, allActivities, before, after, callback);
    }
    else {
      return true;
    }
  }
  catch (error) {
    if (abortSignal.aborted) return;
  }
}

const getActivityLapsAsync = async (id: number, accessToken: string) => {
  try {
    const uri = `activities/${id}/laps`;
    const response = await stravaFetch(uri, accessToken);

    return response;
  }
  catch (error) {
    console.log(error);
  }
}

export { getActivitiesAsync, getActivityLapsAsync };
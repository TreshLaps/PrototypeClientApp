export function secondsToTimeSpan(secs: number) {
  if (!secs || secs <= 0) return { hours: 0, minutes: 0, seconds: 0, hundredth: 0 };

  const secString = secs.toString();

  const sec_num = parseInt(secString, 10);
  const hundredth = Number(((secs - sec_num) * 100).toFixed(2));
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  const seconds = sec_num - (hours * 3600) - (minutes * 60);

  return { hours, minutes, seconds, hundredth }
}

export function getPaceString(seconds: number, meters: number, useMetric = true) {
  const paceSeconds = getPaceSeconds(seconds, meters, useMetric);

  const sec = Math.round(paceSeconds) % 60;
  const secString = sec >= 10 ? sec + '' : '0' + sec;

  const min = sec === 0 ? Math.round(paceSeconds / 60) : Math.floor(paceSeconds / 60);
  const minString = min >= 10 ? min + '' : '0' + min;

  return `${minString}:${secString}`;
}

export function getSpeedString(seconds: number, meters: number, useMetric = true) {
  //km/h
  if (useMetric) {
    const kmh = (meters / 1000) / (seconds / 3600);
    return `${Number.parseFloat(kmh.toFixed(2))} km/h`;
  }
  else {
    const mih = (meters / 1609) / (seconds / 3600);
    return `${Number.parseFloat(mih.toFixed(2))} mi/h`;
  }
}

export function getPaceSeconds(seconds: number, meters: number, useMetric = true) {
  if (useMetric) {
    return seconds / (meters / 1000);
  }
  else {
    return seconds / (meters / 1609);
  }
}

export function timespanToSeconds(timespan: { hours: number, minutes: number, seconds: number }) {
  return timespan.hours * 3600 + timespan.minutes * 60 + timespan.seconds;
}

export function secondsToTimeSpanString(totalSeconds: number) {
  var timeSpan = secondsToTimeSpan(totalSeconds);

  const { hours, minutes, seconds } = timeSpan;
  const hoursString = hours.toString();
  const minutesString = minutes >= 10 ? minutes + '' : '0' + minutes;
  const secondsString = seconds >= 10 ? seconds + '' : '0' + seconds;

  var output = `${secondsString}`;

  if (minutesString !== '00') output = `${minutesString}:${output}`;
  if (hoursString !== '0') output = `${hoursString}:${output}`;

  return output;
}

export function paceStringToMs(paceString: string) {
  const comps = paceString.split(":");

  const mins = parseInt(comps[0]);
  const secs = parseInt(comps[1]);

  return 16.6666 / (mins + secs / 60);
}

export function metersToDistanceFormatted(meters: number, useMetric = true) {
  if (useMetric) {
    return `${Math.round((meters / 1000) * 100) / 100} km`;
  }
  else {
    return `${Math.round((meters / 1609) * 100) / 100} mi`;
  }
}
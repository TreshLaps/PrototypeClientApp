import { Button, Container, Grid, TextField } from "@material-ui/core";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import DateField from "../../components/DateField";
import StravaAppForm from "../../components/StravaAppForm";
import { paceStringToMs } from "../../utils/calculator";
import { getActivitiesAsync } from "../../utils/strava/stravaApi";
import Activity from "./Activity";

export default function ImportActivites() {
  const abortRef = useRef(new AbortController());
  const [importedActivities, setImportedActivities] = useState<any[]>([]);

  const [fromDateString, setFromDateString] = useState(moment().subtract(7, 'd').format('YYYY-MM-DD'));
  const [toDateString, setToDateString] = useState(moment().format('YYYY-MM-DD'));

  const [fromPaceString, setFromPaceString] = useState('3:30');
  const [toPaceString, setToPaceString] = useState('4:00');

  const [fromPaceMs, setFromPaceMs] = useState(0);
  const [toPaceMs, setToPaceMs] = useState(0);

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const newValue = paceStringToMs(fromPaceString);
    if (isNaN(newValue)) return;
    setFromPaceMs(newValue)
  }, [fromPaceString])

  useEffect(() => {
    const newValue = paceStringToMs(toPaceString);
    if (isNaN(newValue)) return;
    setToPaceMs(newValue)
  }, [toPaceString])

  const importClicked = () => {
    const before = moment(toDateString).toDate();
    const after = moment(fromDateString).toDate();

    getActivitiesAsync(accessToken, abortRef.current.signal, before, after, (allActivities, nextPage, loadedCount) => {
      setImportedActivities(allActivities);
    });
  }

  return (
    <Container>
      <StravaAppForm onAccessTokenFetched={(token) => setAccessToken(token)} />

      {accessToken && <div>
        <DateField
          initialValue={fromDateString}
          label='From date'
          id='from-date-field'
          onChange={setFromDateString}
        />
        <DateField
          initialValue={toDateString}
          label='To date'
          id='to-date-field'
          onChange={setToDateString}
        />
        <TextField
          value={fromPaceString}
          label='From pace'
          id='from-pace-field'
          onChange={(e) => setFromPaceString(e.target.value)}
        />
        <TextField
          value={toPaceString}
          label='To pace'
          id='to-pace-field'
          onChange={(e) => setToPaceString(e.target.value)}
        />

        <Button onClick={importClicked}>Import</Button>
      </div>}
      <Grid container spacing={10}>
        {importedActivities.map(activity => (
          <Activity
            key={activity.id}
            activity={activity}
            accessToken={accessToken}
            fromPaceMs={fromPaceMs}
            toPaceMs={toPaceMs} />)
        )}
      </Grid>
    </Container>
  )
}
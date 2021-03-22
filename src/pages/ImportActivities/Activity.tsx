import { useEffect, useState } from "react";
import { Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { getActivityLapsAsync } from "../../utils/strava/stravaApi";
import { getPaceString, metersToDistanceFormatted, secondsToTimeSpanString } from "../../utils/calculator";

interface ActivityProps {
  activity: any;
  accessToken: string;
  fromPaceMs: number;
  toPaceMs: number;
}

export default function Activity(props: ActivityProps) {
  const [laps, setLaps] = useState<any[]>([]);
  const [filteredLaps, setFilteredLaps] = useState<any[]>([]);
  const [tresholdDistance, setTresholdDistance] = useState(0);

  useEffect(() => {
    if (laps.length > 0) return;

    (async () => {
      const fetchedLaps = await getActivityLapsAsync(props.activity.id, props.accessToken);
      setLaps(fetchedLaps);
    })();
  }, [props, laps])

  useEffect(() => {
    if (laps.length === 0) return;

    var lapsToFilter = [];
    var treshDistance = 0;
    for (var i = 0; i < laps.length; i++) {
      const lap = laps[i];

      if (lap.average_speed > props.toPaceMs && lap.average_speed < props.fromPaceMs) {
        lapsToFilter.push(lap);
        treshDistance += lap.distance;
      }
    }
    setFilteredLaps(lapsToFilter);
    setTresholdDistance(treshDistance);
  }, [props, laps])

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant='h4'>{props.activity.name}</Typography>
          <Typography><strong>Total:</strong> {metersToDistanceFormatted(props.activity.distance, true)}</Typography>
          <Typography><strong>Treshold:</strong> {metersToDistanceFormatted(tresholdDistance, true)}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lap</TableCell>
                <TableCell>Pace</TableCell>
                <TableCell>Distance</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Heartrate (avg/max)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLaps.map(lap => {
                return <TableRow key={lap.name}>
                  <TableCell>
                    {lap.name}
                  </TableCell>
                  <TableCell>
                    {getPaceString(lap.elapsed_time, lap.distance, true)}
                  </TableCell>
                  <TableCell>
                    {lap.distance}m
                </TableCell>
                  <TableCell>
                    {secondsToTimeSpanString(lap.elapsed_time)}
                  </TableCell>
                  <TableCell>
                    {lap.average_heartrate} / {lap.max_heartrate}
                  </TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
  )
}
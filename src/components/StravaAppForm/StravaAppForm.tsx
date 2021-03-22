import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import StravaButton from "../StravaButton";
import { getAccessToken } from "../../utils/strava/stravaAuth";
import { useRouter } from "../../utils/hooks/useRouter";

const style = {
  marginTop: 10
}

interface StravaAppFormProps {
  onAccessTokenFetched: (value: string) => void;
}

export default function StravaAppForm(props: StravaAppFormProps) {
  const router = useRouter();

  const [clientId, setClientId] = useState(router.query.clientId ?? '');
  const [clientSecret, setClientSecret] = useState(router.query.clientSecret ?? '');
  const [isFetched, setFetched] = useState(false);

  useEffect(() => {
    if (isFetched) return;
    if (!router.query.code) return;
    if (!clientId) return;
    if (!clientSecret) return;

    (async () => {
      const accessToken = await getAccessToken(clientId, clientSecret, router.query.code);
      setFetched(true);
      props.onAccessTokenFetched(accessToken);
    })();
  }, [isFetched, router, clientId, clientSecret, props])

  return (
    <form noValidate autoComplete='off'>
      <TextField
        label="Client ID"
        value={clientId}
        onChange={e => setClientId(e.target.value)}
        variant="outlined"
        id="client-id-field"
        fullWidth
        style={style}
      />
      {router.query.code && <TextField
        label="Client secret"
        value={clientSecret}
        onChange={e => setClientSecret(e.target.value)}
        variant="outlined"
        id="client-secret-field"
        fullWidth
        style={style}
      />}
      <StravaButton clientId={clientId} />
    </form>
  )
}
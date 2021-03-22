import { TextField } from "@material-ui/core";
import { useEffect, useState } from "react";

interface DateFieldProps {
  initialValue: string;
  label: string,
  id: string,
  onChange: (value: string) => void;
}

export default function DateField(props: DateFieldProps) {
  const [stringValue, setStringValue] = useState(props.initialValue);

  useEffect(() => {
    props.onChange(stringValue);
  }, [stringValue, props])

  return (
    <TextField
      id={props.id}
      label={props.label}
      type="date"
      value={stringValue}
      onChange={(e) => setStringValue(e.target.value)}
    />
  )
}
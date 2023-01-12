import {
  Avatar,
  Card,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { CalendarToday } from "@material-ui/icons";
import { useStateValue } from "../state";
import { Entry } from "../types";

export const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Card key={entry.id} style={{ marginTop: 10, padding: 20 }}>
      <Tooltip title="Date">
        <Chip
          label={new Date(entry.date).toLocaleDateString()}
          icon={<CalendarToday />}
        ></Chip>
      </Tooltip>
      <Typography style={{ marginTop: 10 }}>{entry.description}</Typography>
      {entry.diagnosisCodes && (
        <List>
          {entry.diagnosisCodes.map((diagnosisCode) => (
            <ListItem key={diagnosisCode}>
              <ListItemAvatar>
                <Avatar style={{ fontSize: "0.75em" }}>{diagnosisCode}</Avatar>
              </ListItemAvatar>
              <Tooltip title={diagnoses[diagnosisCode]?.latin || ""}>
                <Typography>{diagnoses[diagnosisCode]?.name}</Typography>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
};

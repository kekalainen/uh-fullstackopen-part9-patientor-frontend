import {
  Avatar,
  Card,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  SvgIcon,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  AssignmentInd,
  Business,
  CalendarToday,
  Favorite,
  LocalHospital,
  Work,
} from "@material-ui/icons";
import { createElement } from "react";
import HealthRatingBar from "../components/HealthRatingBar";
import { useStateValue } from "../state";
import { Entry } from "../types";
import { assertNever } from "../utils";

const entryIcon = (entry: Entry): typeof SvgIcon => {
  switch (entry.type) {
    case "HealthCheck":
      return Favorite;
    case "Hospital":
      return LocalHospital;
    case "OccupationalHealthcare":
      return Work;
    default:
      return assertNever(entry);
  }
};

const TypeSpecificEntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return (
        <div style={{ marginTop: 25 }}>
          <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
        </div>
      );
    case "Hospital":
      return (
        <>
          <Typography variant="h6">Discharge</Typography>
          <Tooltip
            style={{ marginTop: 5, marginBottom: 10 }}
            title="Discharge date"
          >
            <Chip
              label={new Date(entry.discharge.date).toLocaleDateString()}
              icon={<CalendarToday />}
            ></Chip>
          </Tooltip>
          <Typography>{entry.discharge.criteria}</Typography>
        </>
      );
    case "OccupationalHealthcare":
      return (
        <>
          <Tooltip title="Employer" style={{ marginTop: 10 }}>
            <Chip label={entry.employerName} icon={<Business />}></Chip>
          </Tooltip>
          {entry.sickLeave && (
            <>
              <Typography
                variant="h6"
                style={{ marginTop: 10, marginBottom: 5 }}
              >
                Sick leave
              </Typography>
              <Tooltip style={{ marginRight: 15 }} title="Start date">
                <Chip
                  label={new Date(
                    entry.sickLeave.startDate
                  ).toLocaleDateString()}
                  icon={<CalendarToday />}
                ></Chip>
              </Tooltip>
              <Tooltip title="End date">
                <Chip
                  label={new Date(entry.sickLeave.endDate).toLocaleDateString()}
                  icon={<CalendarToday />}
                ></Chip>
              </Tooltip>
            </>
          )}
        </>
      );
    default:
      return assertNever(entry);
  }
};

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
      <Tooltip title="Type" style={{ marginLeft: 15, marginRight: 15 }}>
        <Chip
          label={entry.type.split(/(?=[A-Z])/).join(" ")}
          icon={createElement(entryIcon(entry))}
        ></Chip>
      </Tooltip>
      <Tooltip title="Specialist">
        <Chip label={entry.specialist} icon={<AssignmentInd />}></Chip>
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
      <TypeSpecificEntryDetails entry={entry} />
    </Card>
  );
};

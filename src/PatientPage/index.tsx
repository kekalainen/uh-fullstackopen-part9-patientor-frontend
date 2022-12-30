import { Chip, Grid, Tooltip, Typography } from "@material-ui/core";
import { CalendarToday, Wc, PermIdentity, Work } from "@material-ui/icons";
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Patient } from "../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();

  const patient = id ? patients[id] : null;

  useEffect(() => {
    if (!id || patient?.ssn) return;

    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch({ type: "ADD_PATIENT", payload: patient });
      } catch (e) {
        console.error(e);
      }
    };

    void fetchPatient();
  }, [dispatch]);

  if (!patient) return null;

  return (
    <Grid container spacing={2} style={{ marginTop: 10 }}>
      <Grid item xs={12}>
        <Typography variant="h4">{patient.name}</Typography>
      </Grid>
      <Grid item>
        <Tooltip title="Gender">
          <Chip label={patient.gender} icon={<Wc />}></Chip>
        </Tooltip>
      </Grid>
      {patient.ssn && (
        <Grid item>
          <Tooltip title="Social security number">
            <Chip label={patient.ssn} icon={<PermIdentity />}></Chip>
          </Tooltip>
        </Grid>
      )}
      <Grid item>
        <Tooltip title="Occupation">
          <Chip label={patient.occupation} icon={<Work />}></Chip>
        </Tooltip>
      </Grid>
      {patient.dateOfBirth && (
        <Grid item>
          <Tooltip title="Date of birth">
            <Chip
              label={new Date(patient.dateOfBirth).toLocaleDateString()}
              icon={<CalendarToday />}
            ></Chip>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
};

export default PatientPage;

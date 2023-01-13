import { Button, Chip, Grid, Tooltip, Typography } from "@material-ui/core";
import { CalendarToday, Wc, PermIdentity, Work } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormModal from "../components/FormModal";
import { apiBaseUrl } from "../constants";
import { addEntry, addPatient, useStateValue } from "../state";
import { Entry, Patient } from "../types";
import AddEntryForm, { EntryFormValues } from "./AddEntryForm";
import { EntryDetails } from "./EntryDetails";

const usePatientEntryModal = (id: Patient["id"] | undefined) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [, dispatch] = useStateValue();

  const openModal = (): void => {
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submit = async (values: EntryFormValues) => {
    if (!id) return;

    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntry(id, newEntry));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(
          String(e?.response?.data?.error) || "Unrecognized axios error"
        );
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return {
    open: openModal,
    close: closeModal,
    isOpen: modalOpen,
    error,
    submit,
  };
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const modal = usePatientEntryModal(id);

  const patient = id ? patients[id] : null;

  useEffect(() => {
    if (!id || patient?.ssn) return;

    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(addPatient(patient));
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
      {patient.entries && (
        <Grid item xs={12}>
          <Typography variant="h5">Entries</Typography>
          <FormModal
            title="Add a new entry"
            modalOpen={modal.isOpen}
            onSubmit={modal.submit}
            error={modal.error}
            onClose={modal.close}
            formComponent={AddEntryForm}
          />
          <Button
            variant="contained"
            onClick={modal.open}
            style={{ marginTop: 10, marginBottom: 10 }}
          >
            Add entry
          </Button>
          {!patient.entries.length && (
            <Typography>No entries to display.</Typography>
          )}
          {patient.entries.map((entry) => (
            <EntryDetails key={entry.id} entry={entry} />
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default PatientPage;

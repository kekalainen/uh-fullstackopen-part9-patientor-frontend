import { Checkbox, FormControlLabel, FormGroup, Grid } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import {
  DiagnosisSelection as DiagnosisSelectionField,
  TextField,
} from "../components/FormFields";
import { FormActions } from "../components/FormActions";
import { SelectField, SelectOption } from "../components/FormFields";
import { useStateValue } from "../state";
import { Entry, EntryTypes, HealthCheckRating } from "../types";
import { assertNever } from "../utils";
import { FormProps } from "../components/FormModal";

export type EntryFormValues = Omit<Entry, "id">;

const typeOptions: SelectOption<Entry["type"]>[] = [
  ...EntryTypes.map((type) => ({
    value: type,
    label: type.split(/(?=[A-Z])/).join(" "),
  })),
];

const healthCheckOptions: SelectOption<HealthCheckRating>[] = [
  ...Object.values(HealthCheckRating)
    .slice(Object.values(HealthCheckRating).length / 2)
    .map((rating) => ({
      value: rating as HealthCheckRating,
      label: HealthCheckRating[rating as number].split(/(?=[A-Z])/).join(" "),
    })),
];

type Dictionary<T> = { [field: string]: T };

const validationErrorMessages: Dictionary<string> = {
  required: "This field is required",
  date: "Incorrect date format",
};

const validators: Dictionary<(value: string) => string | undefined> = {
  required: (value: string) => {
    if (!value) return validationErrorMessages.required;
  },
  date: (value: string) => {
    if (!value) return validationErrorMessages.required;
    if (!Date.parse(value)) return validationErrorMessages.date;
  },
};

const typeSpecificInitialValues = (type: Entry["type"]): object => {
  switch (type) {
    case "HealthCheck":
      return {
        healthCheckRating: HealthCheckRating.Healthy,
      };
    case "Hospital":
      return {
        discharge: {
          date: "",
          criteria: "",
        },
      };
    case "OccupationalHealthcare":
      return {
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        },
      };
    default:
      return assertNever(type);
  }
};

export const AddEntryForm = ({
  onSubmit,
  onCancel,
}: FormProps<EntryFormValues>) => {
  const [{ diagnoses }] = useStateValue();
  const [sickLeave, setSickLeave] = useState<boolean>(false);

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        type: EntryTypes[0] as Entry["type"],
        ...EntryTypes.reduce(
          (values, type) => ({
            ...values,
            ...typeSpecificInitialValues(type),
          }),
          {}
        ),
      }}
      onSubmit={(values) => {
        if (!sickLeave && "sickLeave" in values)
          onSubmit({ ...values, sickLeave: undefined } as EntryFormValues);
        else onSubmit(values);
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => (
        <Form>
          <Field
            label="Description"
            name="description"
            component={TextField}
            validate={validators.required}
          ></Field>
          <Field
            label="Date"
            placeholder="YYYY-MM-DD"
            name="date"
            component={TextField}
            validate={validators.date}
          ></Field>
          <Field
            label="Specialist"
            name="specialist"
            component={TextField}
            validate={validators.required}
          ></Field>
          <DiagnosisSelectionField
            diagnoses={Object.values(diagnoses)}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />
          <SelectField name="type" label="Type" options={typeOptions} />
          {((): JSX.Element => {
            switch (values.type) {
              case "HealthCheck":
                return (
                  <SelectField
                    name="healthCheckRating"
                    label="Rating"
                    options={healthCheckOptions}
                  />
                );
              case "Hospital":
                return (
                  <>
                    <Field
                      label="Discharge date"
                      placeholder="YYYY-MM-DD"
                      name="discharge.date"
                      component={TextField}
                      validate={validators.date}
                    ></Field>
                    <Field
                      label="Discharge criteria"
                      name="discharge.criteria"
                      component={TextField}
                      validate={validators.required}
                    ></Field>
                  </>
                );
              case "OccupationalHealthcare":
                return (
                  <>
                    <Field
                      label="Employer"
                      name="employerName"
                      component={TextField}
                      validate={validators.required}
                    ></Field>
                    <FormGroup>
                      <FormControlLabel
                        label="Sick leave"
                        control={
                          <Checkbox
                            checked={sickLeave}
                            onChange={(_, checked) => setSickLeave(checked)}
                          />
                        }
                      />
                    </FormGroup>
                    {sickLeave && (
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Field
                            label="Sick leave start date"
                            name="sickLeave.startDate"
                            component={TextField}
                            validate={validators.date}
                          ></Field>
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            label="Sick leave end date"
                            name="sickLeave.endDate"
                            component={TextField}
                            validate={validators.date}
                          ></Field>
                        </Grid>
                      </Grid>
                    )}
                  </>
                );
              default:
                return assertNever(values.type);
            }
          })()}
          <FormActions dirty={dirty} isValid={isValid} onCancel={onCancel} />
        </Form>
      )}
    </Formik>
  );
};

export default AddEntryForm;

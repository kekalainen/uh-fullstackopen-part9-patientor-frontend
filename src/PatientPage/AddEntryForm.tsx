import { Field, Form, Formik } from "formik";
import {
  DiagnosisSelection as DiagnosisSelectionField,
  TextField,
} from "../components/FormFields";
import { FormActions } from "../components/FormActions";
import { SelectField, SelectOption } from "../components/FormFields";
import { useStateValue } from "../state";
import { Entry, EntryTypes, HealthCheckRating } from "../types";
import { FormProps } from "../components/FormModal";

export type EntryFormValues = Omit<Entry, "id">;

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
    default:
      return {};
  }
};

export const AddEntryForm = ({
  onSubmit,
  onCancel,
}: FormProps<EntryFormValues>) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        type: EntryTypes[0],
        ...typeSpecificInitialValues(EntryTypes[0]),
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const errors: Dictionary<string> = {};

        for (const key of Object.keys(values)) {
          const value = { ...values }[key];
          if (typeof value === "string" && value.length === 0)
            errors[key] = validationErrorMessages.required;
        }

        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => (
        <Form>
          <Field
            label="Description"
            name="description"
            component={TextField}
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
          ></Field>
          <DiagnosisSelectionField
            diagnoses={Object.values(diagnoses)}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />
          {values.type === "HealthCheck" && (
            <SelectField
              name="healthCheckRating"
              label="Rating"
              options={healthCheckOptions}
            />
          )}
          <FormActions dirty={dirty} isValid={isValid} onCancel={onCancel} />
        </Form>
      )}
    </Formik>
  );
};

export default AddEntryForm;

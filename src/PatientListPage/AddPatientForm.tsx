import React from "react";
import { Field, Formik, Form } from "formik";

import { TextField, SelectField, SelectOption } from "../components/FormFields";
import { Gender, Patient } from "../types";
import { FormActions } from "../components/FormActions";
import { FormProps } from "../components/FormModal";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type PatientFormValues = Omit<Patient, "id" | "entries">;

const genderOptions: SelectOption<Gender>[] = [
  { value: Gender.Male, label: "Male" },
  { value: Gender.Female, label: "Female" },
  { value: Gender.Other, label: "Other" },
];

export const AddPatientForm = ({ onSubmit, onCancel }: FormProps<PatientFormValues>) => {
  return (
    <Formik
      initialValues={{
        name: "",
        ssn: "",
        dateOfBirth: "",
        occupation: "",
        gender: Gender.Other,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.name) {
          errors.name = requiredError;
        }
        if (!values.ssn) {
          errors.ssn = requiredError;
        }
        if (!values.dateOfBirth) {
          errors.dateOfBirth = requiredError;
        }
        if (!values.occupation) {
          errors.occupation = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <Field
              label="Name"
              placeholder="Name"
              name="name"
              component={TextField}
            />
            <Field
              label="Social Security Number"
              placeholder="SSN"
              name="ssn"
              component={TextField}
            />
            <Field
              label="Date Of Birth"
              placeholder="YYYY-MM-DD"
              name="dateOfBirth"
              component={TextField}
            />
            <Field
              label="Occupation"
              placeholder="Occupation"
              name="occupation"
              component={TextField}
            />
            <SelectField label="Gender" name="gender" options={genderOptions} />
            <FormActions dirty={dirty} isValid={isValid} onCancel={onCancel} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPatientForm;

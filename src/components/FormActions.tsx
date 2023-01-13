import { Button, Grid } from "@material-ui/core";

interface FormActionsProps {
  dirty: boolean;
  isValid: boolean;
  onCancel: () => void;
}

export const FormActions = ({ dirty, isValid, onCancel }: FormActionsProps) => (
  <Grid>
    <Grid item>
      <Button
        color="secondary"
        variant="contained"
        style={{ float: "left" }}
        type="button"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Grid>
    <Grid item>
      <Button
        style={{
          float: "right",
        }}
        type="submit"
        variant="contained"
        disabled={!dirty || !isValid}
      >
        Add
      </Button>
    </Grid>
  </Grid>
);

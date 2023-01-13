import { Dialog, DialogTitle, DialogContent, Divider } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export interface FormProps<FormValues> {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

interface Props<FormValues> extends Pick<FormProps<FormValues>, "onSubmit"> {
  title: string;
  modalOpen: boolean;
  onClose: () => void;
  error?: string;
  formComponent: ({ onSubmit, onCancel }: FormProps<FormValues>) => JSX.Element;
}

export const FormModal = <FormValues,>({
  title,
  modalOpen,
  onClose,
  onSubmit,
  error,
  formComponent: Form,
}: Props<FormValues>) => {
  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent>
        {error && <Alert severity="error">{`Error: ${error}`}</Alert>}
        <Form onSubmit={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;

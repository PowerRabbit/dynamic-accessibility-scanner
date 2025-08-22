import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { ReactNode } from "react";

type AlertDialogProps = {
  title: string;
  content: ReactNode;
  actionText: string;
  onAction: () => void;
  triggerButton?: ReactNode;
};

export const AlertDialog = ({
  title,
  content,
  actionText,
  onAction,
  triggerButton = 'Open',
}: AlertDialogProps) => {
  return (
    <Dialog.Root role="alertdialog">
      <Dialog.Trigger asChild>
          {triggerButton}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>{content}</Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="red" onClick={onAction}>
                    {actionText}
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

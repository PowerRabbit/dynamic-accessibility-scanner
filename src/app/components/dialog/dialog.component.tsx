import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useState } from "react";

type DasDialogProps = {
  title: string;
  type: 'alertdialog' | 'dialog';
  content: ReactNode;
  actionText?: string;
  actionColor?: string;
  onAction?: () => void;
  showAction?: boolean;
  showCancel?: boolean;
  triggerButton?: ReactNode;
};

const DialogContext = createContext<{ close: () => void }>({close: () => {}});

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  return ctx;
};

export const DasDialog = ({
  title,
  content,
  type,
  actionText = '',
  actionColor = 'teal',
  onAction = () => {},
  showAction = true,
  showCancel = true,
  triggerButton = 'Open',
}: DasDialogProps) => {
    const [isOpen, setOpen] = useState(false);

    return (
    <DialogContext.Provider value={{ close: () => {setOpen(false)} }}>
        <Dialog.Root role={type}
            open={isOpen}
            onOpenChange={({open}) => setOpen(open)}
        >
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
                {showCancel ?
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                : ''}
                {showAction ?
                <Dialog.ActionTrigger asChild>
                    <Button colorPalette={actionColor} onClick={onAction}>
                        {actionText}
                    </Button>
                </Dialog.ActionTrigger>
                : ''}
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
                </Dialog.CloseTrigger>
            </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
        </Dialog.Root>
    </DialogContext.Provider>
  );
};

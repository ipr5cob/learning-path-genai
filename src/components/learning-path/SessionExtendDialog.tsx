import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Clock } from 'lucide-react';

interface SessionExtendDialogProps {
  open: boolean;
  onExtend: () => void;
  onLogout: () => void;
}

const SessionExtendDialog = ({ open, onExtend, onLogout }: SessionExtendDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="mx-auto w-10 h-10 rounded-xl bg-signal-warning/10 flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-signal-warning" />
          </div>
          <AlertDialogTitle className="text-center text-base-text">
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base-muted text-sm">
            Your session will expire in less than a minute. Would you like to extend it?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2 sm:justify-center">
          <AlertDialogCancel
            onClick={onLogout}
            className="border-base-pure/60 text-base-muted hover:bg-base-major"
          >
            Log out
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onExtend}
            className="bg-accent-major text-plain-white hover:bg-accent-hover"
          >
            Extend Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionExtendDialog;

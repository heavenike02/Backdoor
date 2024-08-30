import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useSAToastMutation } from "@/hooks/useSAToastMutation";
import { sendApplicationEmail } from "@/actions/send-application-email";
import { useToast } from "@/components/ui/use-toast"; // Add this import
import { Link, Check } from 'lucide-react'; // Add this import

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicationUrl: string;
}

export function ShareDialog({ isOpen, onClose, applicationUrl }: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false); // Add state for copied status
  const { toast } = useToast(); // Initialize toast

  const { mutate, isLoading } = useSAToastMutation(sendApplicationEmail, {
    loadingMessage: "Sending email...",
    successMessage: "The application link has been sent successfully.",
    errorMessage: "Failed to send email. Please try again.",
    onSuccess: () => {
      onClose();
      setEmail("");
    },
  });

  const copyToClipboard = async () => { // Add copy function
    try {
      await navigator.clipboard.writeText(applicationUrl);
      setCopied(true);
      toast({
        title: "URL Copied!",
        description: "The application URL has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, applicationUrl });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Application</DialogTitle>
          <DialogDescription>
            Send the application link to an email address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Copy Application URL</Label>
              <div className="col-span-3 flex space-x-2">
                <Input value={applicationUrl} readOnly />
                <Button onClick={copyToClipboard} variant="outline">
                  {copied ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Link className="mr-2 h-4 w-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
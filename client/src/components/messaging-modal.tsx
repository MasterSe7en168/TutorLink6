import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TutorWithProfile } from "@shared/schema";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: TutorWithProfile;
}

export default function MessagingModal({ isOpen, onClose, tutor }: MessagingModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { fromUserId: string; toUserId: string; subject: string; content: string }) => {
      const response = await apiRequest("POST", "/api/messages", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Your message has been sent to the tutor.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "messages"] });
      onClose();
      setSubject("");
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to send messages.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      fromUserId: user.id,
      toUserId: tutor.id,
      subject: subject.trim(),
      content: message.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {tutor.fullName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Lesson inquiry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Hi, I'm interested in learning..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          
          <div className="flex space-x-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// src/app/agent/page.tsx
'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Bot, User, Loader2 } from 'lucide-react';

import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEcosystem } from '@/context/ecosystem-provider';
import { handleAgentChat, type ChatMessage } from './actions';

const initialState = {
  messages: [],
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Send'}
    </Button>
  );
}

export default function AgentChatPage() {
  const { ecosystem } = useEcosystem();
  const [state, formAction] = useFormState(handleAgentChat, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (!state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  const agentName = `HISA`;

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-4rem)]">
      <AppHeader
        title={agentName}
        description="Your AI assistance for the HISA ecosystems"
      />
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot /> AI Conversation
          </CardTitle>
          <CardDescription>
            Your trusted copilot here for you . Ask me anything .
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {state.messages.map((message: ChatMessage, index: number) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${
                    message.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.role === 'model' && (
                    <Avatar>
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xl rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                    <Avatar>
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <form
            ref={formRef}
            action={formAction}
            className="flex w-full items-center space-x-2"
          >
            <input type="hidden" name="ecosystem" value={ecosystem} />
            <input type="hidden" name="history" value={JSON.stringify(state.messages)} />
            <Input
              id="message"
              name="message"
              placeholder="Type your message here..."
              autoComplete="off"
              required
            />
            <SubmitButton />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

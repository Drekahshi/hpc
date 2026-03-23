// src/app/agent/actions.ts
'use server';

import { z } from 'zod';
import { agentChat } from '@/ai/flows/agent-chat-flow';

const formSchema = z.object({
  message: z.string().min(1, 'Message is required.'),
  ecosystem: z.enum(['jani', 'umoja', 'culture']),
  history: z.string(),
});

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

type ChatState = {
  messages: ChatMessage[];
  error: string | null;
};

export async function handleAgentChat(prevState: ChatState, formData: FormData): Promise<ChatState> {
  try {
    const parsed = formSchema.safeParse({
      message: formData.get('message'),
      ecosystem: formData.get('ecosystem'),
      history: formData.get('history'),
    });

    if (!parsed.success) {
      return {
        ...prevState,
        error: parsed.error.errors.map((e) => e.message).join(', '),
      };
    }

    const { message, ecosystem, history } = parsed.data;

    const currentHistory = JSON.parse(history) as ChatMessage[];
    const userMessage: ChatMessage = { role: 'user', content: message };
    
    const updatedHistory = [...currentHistory, userMessage];

    const result = await agentChat({
      ecosystem,
      question: message,
    });

    const agentMessage: ChatMessage = { role: 'model', content: result.answer };
    
    return {
      messages: [...updatedHistory, agentMessage],
      error: null,
    };
  } catch (error) {
    console.error('Agent Chat Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    
    const agentErrorMessage: ChatMessage = { role: 'model', content: `Sorry, something went wrong: ${errorMessage}` };

    return { 
        ...prevState, 
        messages: [...prevState.messages, agentErrorMessage],
        error: errorMessage 
    };
  }
}

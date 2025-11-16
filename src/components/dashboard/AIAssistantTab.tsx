import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantTabProps {
  projectContext: {
    project: {
      name: string;
      type: string;
      startDate?: string;
      endDate?: string;
    };
    metrics: Array<{
      name: string;
      value: number;
      valueType: string;
    }>;
    goals: {
      leadsTarget: number;
      revenueTarget: number;
      maxCPL: number;
      minROI: number;
    };
    current: {
      leads: number;
      revenue: number;
      cpl: number;
      roi: number;
    };
    forecast: {
      daysElapsed: number;
      projectedLeads: number;
      projectedRevenue: number;
      projectedROI: number;
    };
    alerts: Array<{
      title: string;
      description: string;
    }>;
    dailyData?: Array<{
      date: string;
      leads: number;
      revenue: number;
    }>;
  };
}

const AIAssistantTab = ({ projectContext }: AIAssistantTabProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `👋 Olá! Sou o **Assistente de Dados** do seu projeto "${projectContext.project.name}".

Posso te ajudar a:
- Analisar suas métricas e tendências
- Comparar resultados com suas metas
- Identificar oportunidades de melhoria
- Responder perguntas sobre seus dados

**Exemplos de perguntas:**
- Como está meu CPL nos últimos dias?
- Estou acima ou abaixo da meta?
- Qual foi meu melhor dia de vendas?
- O que você recomenda melhorar?

Pode perguntar à vontade! 🚀`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            message: input.trim(),
            projectContext,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao processar requisição");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling assistant:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível processar sua pergunta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "Como está meu desempenho hoje?",
    "Estou atingindo minhas metas?",
    "Qual foi meu melhor dia?",
    "O que devo melhorar?",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          IA Assistente
        </h2>
        <p className="text-muted-foreground text-sm">
          Converse com a IA sobre seus dados e receba insights personalizados
        </p>
      </div>

      {/* Chat Interface */}
      <Card className="border-2 border-border/50 rounded-2xl h-[600px] flex flex-col">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-lg font-semibold">Chat</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 border border-border/50"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    )}
                    <p className={`text-xs mt-2 ${msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 border border-border/50 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Analisando seus dados...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions - Only show when no messages from user yet */}
          {messages.length === 1 && (
            <div className="px-6 pb-4 border-t border-border/50 pt-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Perguntas sugeridas:</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3 justify-start text-left"
                    onClick={() => setInput(question)}
                    disabled={isLoading}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pergunte sobre seus dados..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantTab;

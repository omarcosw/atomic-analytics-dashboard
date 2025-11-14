import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, projectContext } = await req.json();
    
    console.log("Project Assistant request:", { 
      message: message.substring(0, 100),
      hasContext: !!projectContext 
    });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build comprehensive context for the AI
    const contextSummary = `
PROJETO: ${projectContext.project.name}
TIPO: ${projectContext.project.type}
PERÍODO: ${projectContext.project.startDate} até ${projectContext.project.endDate}

MÉTRICAS ATUAIS:
${projectContext.metrics.map((m: any) => `- ${m.name}: ${formatMetricValue(m)}`).join('\n')}

METAS DO PROJETO:
- Leads: ${projectContext.goals.leadsTarget.toLocaleString('pt-BR')} (atual: ${projectContext.current.leads.toLocaleString('pt-BR')})
- Receita: R$ ${projectContext.goals.revenueTarget.toLocaleString('pt-BR')} (atual: R$ ${projectContext.current.revenue.toLocaleString('pt-BR')})
- CPL Máximo: R$ ${projectContext.goals.maxCPL.toFixed(2)} (atual: R$ ${projectContext.current.cpl.toFixed(2)})
- ROI Mínimo: ${projectContext.goals.minROI.toFixed(1)}% (atual: ${projectContext.current.roi.toFixed(1)}%)

PROJEÇÕES (baseado em ${projectContext.forecast.daysElapsed} dias):
- Leads projetados: ${projectContext.forecast.projectedLeads.toLocaleString('pt-BR')}
- Receita projetada: R$ ${projectContext.forecast.projectedRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
- ROI projetado: ${projectContext.forecast.projectedROI.toFixed(1)}%

ALERTAS ATIVOS:
${projectContext.alerts.length > 0 
  ? projectContext.alerts.map((a: any) => `- ${a.title}: ${a.description}`).join('\n')
  : '- Nenhum alerta no momento'}

HISTÓRICO RECENTE (últimos 7 dias):
${projectContext.dailyData ? projectContext.dailyData.map((d: any) => 
  `- ${d.date}: ${d.leads} leads, R$ ${d.revenue.toLocaleString('pt-BR')}`
).join('\n') : 'Dados históricos não disponíveis'}
`.trim();

    const systemPrompt = `Você é o Assistente de Dados do Atomic+ Analytics, especializado em análise de métricas para lançamentos e infoprodutos.

REGRAS FUNDAMENTAIS:
1. Responda SEMPRE em português do Brasil (pt-BR)
2. Use APENAS os dados fornecidos no contexto do projeto
3. Seja direto, claro e objetivo
4. Use números e percentuais para fundamentar suas respostas
5. Estruture respostas em seções quando apropriado

FORMATO DE RESPOSTA IDEAL:
**Resumo**: Resposta direta à pergunta
**Números Importantes**: Métricas relevantes com valores
**Tendências**: O que está melhorando/piorando
**Ações Recomendadas**: 2-3 sugestões práticas

ESTILO:
- Use formatação Markdown (negrito, listas, etc.)
- Seja analítico mas acessível
- Evite jargões técnicos complexos
- Sempre compare com metas quando relevante
- Destaque alertas importantes

DADOS DO PROJETO ATUAL:
${contextSummary}

Responda às perguntas do usuário com base EXCLUSIVAMENTE nos dados acima.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Limite de requisições atingido. Tente novamente em alguns instantes." 
          }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Créditos insuficientes. Adicione créditos ao seu workspace Lovable." 
          }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log("Assistant response generated successfully");

    return new Response(
      JSON.stringify({ 
        role: "assistant", 
        content: assistantMessage 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in project-assistant function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro ao processar requisição" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function formatMetricValue(metric: any): string {
  const value = metric.value;
  switch (metric.valueType) {
    case "currency":
      return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "percent":
      return `${value.toFixed(1)}%`;
    default:
      return value.toLocaleString('pt-BR');
  }
}

import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Política de Privacidade
              </h1>
              <p className="text-muted-foreground mt-1">
                Última atualização: Novembro de 2024
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="prose prose-sm max-w-none pt-6">
            <p className="text-muted-foreground italic mb-6">
              Este é um texto de exemplo de Política de Privacidade. No futuro será substituído pelo conteúdo jurídico apropriado conforme LGPD e outras regulamentações aplicáveis.
            </p>

            <h2 className="text-2xl font-bold mb-4">1. Introdução</h2>
            <p className="mb-6">
              A Atomic+ Analytics ("nós", "nosso" ou "Empresa") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nosso Serviço.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Informações que Coletamos</h2>
            <p className="mb-4">
              Coletamos vários tipos de informações em conexão com o Serviço, incluindo:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Informações pessoais:</strong> Nome, endereço de email, informações de pagamento</li>
              <li><strong>Dados de uso:</strong> Informações sobre como você usa nosso Serviço</li>
              <li><strong>Dados de dashboard:</strong> Métricas, planilhas e dados que você carrega para criar seus dashboards</li>
              <li><strong>Informações técnicas:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">3. Como Usamos Suas Informações</h2>
            <p className="mb-4">
              Usamos as informações coletadas para várias finalidades:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Para fornecer e manter nosso Serviço</li>
              <li>Para notificá-lo sobre mudanças em nosso Serviço</li>
              <li>Para fornecer suporte ao cliente</li>
              <li>Para coletar análises ou informações valiosas para melhorar nosso Serviço</li>
              <li>Para monitorar o uso do Serviço</li>
              <li>Para detectar, prevenir e resolver problemas técnicos</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">4. Compartilhamento de Dados</h2>
            <p className="mb-4">
              Não vendemos, alugamos ou comercializamos suas informações pessoais para terceiros. Podemos compartilhar suas informações apenas nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Com prestadores de serviços que nos ajudam a operar nosso negócio</li>
              <li>Para cumprir obrigações legais</li>
              <li>Para proteger e defender os direitos ou propriedade da Empresa</li>
              <li>Com seu consentimento explícito</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">5. Segurança dos Dados</h2>
            <p className="mb-6">
              A segurança de seus dados é importante para nós. Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Seus Direitos (LGPD)</h2>
            <p className="mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Confirmar a existência de tratamento de dados pessoais</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Anonimizar, bloquear ou eliminar dados desnecessários</li>
              <li>Solicitar a portabilidade de seus dados</li>
              <li>Eliminar dados pessoais tratados com seu consentimento</li>
              <li>Revogar seu consentimento a qualquer momento</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">7. Cookies e Tecnologias Similares</h2>
            <p className="mb-6">
              Usamos cookies e tecnologias similares para rastrear a atividade em nosso Serviço e manter certas informações. Você pode instruir seu navegador a recusar todos os cookies ou indicar quando um cookie está sendo enviado.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Retenção de Dados</h2>
            <p className="mb-6">
              Reteremos suas informações pessoais apenas pelo tempo necessário para os fins estabelecidos nesta Política de Privacidade. Também reteremos e usaremos suas informações na medida necessária para cumprir nossas obrigações legais.
            </p>

            <h2 className="text-2xl font-bold mb-4">9. Alterações a Esta Política</h2>
            <p className="mb-6">
              Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e atualizando a data de "Última atualização".
            </p>

            <h2 className="text-2xl font-bold mb-4">10. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Por email: privacidade@atomicplus.app</li>
              <li>Encarregado de Dados (DPO): dpo@atomicplus.app</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Privacy;

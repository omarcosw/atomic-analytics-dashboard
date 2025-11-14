import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Termos de Uso
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
              Este é um texto de exemplo de Termos de Uso. No futuro será substituído pelo conteúdo jurídico apropriado.
            </p>

            <h2 className="text-2xl font-bold mb-4">1. Introdução</h2>
            <p className="mb-4">
              Bem-vindo ao Atomic+ Analytics ("nós", "nosso" ou "Serviço"). Estes Termos de Uso regem o uso da nossa plataforma de analytics e dashboards inteligentes para infoprodutores.
            </p>
            <p className="mb-6">
              Ao acessar ou usar nosso Serviço, você concorda em estar vinculado a estes Termos. Se você não concorda com qualquer parte destes termos, não deve usar nosso Serviço.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Uso do Serviço</h2>
            <p className="mb-4">
              Você concorda em usar o Serviço apenas para fins legais e de acordo com estes Termos. Você concorda em não usar o Serviço:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>De qualquer maneira que viole qualquer lei ou regulamento aplicável</li>
              <li>Para transmitir, ou procurar a transmissão de, qualquer material publicitário ou promocional não solicitado</li>
              <li>Para personificar ou tentar personificar a Empresa, um funcionário da Empresa, outro usuário ou qualquer outra pessoa ou entidade</li>
              <li>De qualquer maneira que possa desabilitar, sobrecarregar, danificar ou prejudicar o Serviço</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">3. Contas de Usuário</h2>
            <p className="mb-4">
              Quando você cria uma conta conosco, você deve nos fornecer informações precisas, completas e atuais em todos os momentos. A falha em fazê-lo constitui uma violação dos Termos.
            </p>
            <p className="mb-6">
              Você é responsável por proteger a senha que você usa para acessar o Serviço e por quaisquer atividades ou ações sob sua senha.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. Propriedade Intelectual</h2>
            <p className="mb-4">
              O Serviço e seu conteúdo original, recursos e funcionalidade são e permanecerão propriedade exclusiva do Atomic+ Analytics e seus licenciadores.
            </p>
            <p className="mb-6">
              O Serviço é protegido por direitos autorais, marcas registradas e outras leis de propriedade intelectual.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. Dados do Usuário</h2>
            <p className="mb-4">
              Você mantém todos os direitos sobre os dados que você carrega para o Serviço. Nós não reivindicamos propriedade sobre seus dados.
            </p>
            <p className="mb-6">
              Ao usar o Serviço, você nos concede uma licença mundial, não exclusiva e livre de royalties para usar, processar e exibir seus dados apenas com o propósito de fornecer o Serviço a você.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Limitação de Responsabilidade</h2>
            <p className="mb-4">
              Em nenhum caso o Atomic+ Analytics, nem seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos.
            </p>

            <h2 className="text-2xl font-bold mb-4">7. Alterações aos Termos</h2>
            <p className="mb-4">
              Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer pelo menos 30 dias de aviso prévio antes que quaisquer novos termos entrem em vigor.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco através de suporte@atomicplus.app
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Terms;

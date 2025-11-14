import { useState } from "react";
import { useProjectNotes } from "@/hooks/useProjectNotes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, Circle, Paperclip, Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface NotesTabProps {
  projectId: string;
}

export const NotesTab = ({ projectId }: NotesTabProps) => {
  const { notes, isLoading, addNote, updateNote, deleteNote, uploadAttachment } = useProjectNotes(projectId);
  const { toast } = useToast();
  const [newNoteContent, setNewNoteContent] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Por favor, escreva algo antes de adicionar a nota.",
        variant: "destructive",
      });
      return;
    }

    addNote({ content: newNoteContent, attachments });
    setNewNoteContent("");
    setAttachments([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie apenas imagens.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadAttachment(file);
      setAttachments([...attachments, url]);
      toast({
        title: "Imagem enviada",
        description: "A imagem foi adicionada à nota.",
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Carregando notas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Nota</CardTitle>
          <CardDescription>
            Adicione observações, insights e anotações importantes sobre o projeto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Digite sua nota aqui..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={4}
          />
          
          {attachments.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {attachments.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt={`Anexo ${idx + 1}`} className="h-20 w-20 object-cover rounded border" />
                  <button
                    onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleAddNote} disabled={uploading}>
              Adicionar Nota
            </Button>
            <Button variant="outline" disabled={uploading} asChild>
              <label className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Enviando..." : "Anexar Imagem"}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhuma nota ainda. Adicione sua primeira observação!
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className={note.is_resolved ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {format(new Date(note.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </CardTitle>
                      {note.is_resolved && (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Resolvida
                        </Badge>
                      )}
                    </div>
                    {note.attachments && note.attachments.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Paperclip className="h-3 w-3" />
                        {note.attachments.length} {note.attachments.length === 1 ? "anexo" : "anexos"}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateNote({ id: note.id, is_resolved: !note.is_resolved })}
                    >
                      {note.is_resolved ? (
                        <>
                          <Circle className="h-4 w-4 mr-1" />
                          Reabrir
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Resolver
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap">{note.content}</p>
                
                {note.attachments && note.attachments.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {note.attachments.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={url}
                          alt={`Anexo ${idx + 1}`}
                          className="h-32 w-32 object-cover rounded border hover:opacity-80 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProjectNote {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  is_resolved: boolean;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export const useProjectNotes = (projectId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["project-notes", projectId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("project_notes")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectNote[];
    },
  });

  const addNote = useMutation({
    mutationFn: async ({ content, attachments = [] }: { content: string; attachments?: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("project_notes")
        .insert({
          project_id: projectId,
          user_id: user.id,
          content,
          attachments,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-notes", projectId] });
      toast({
        title: "Nota criada",
        description: "Sua nota foi adicionada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar nota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, content, is_resolved }: { id: string; content?: string; is_resolved?: boolean }) => {
      const updates: Partial<ProjectNote> = {};
      if (content !== undefined) updates.content = content;
      if (is_resolved !== undefined) updates.is_resolved = is_resolved;

      const { data, error } = await supabase
        .from("project_notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-notes", projectId] });
      toast({
        title: "Nota atualizada",
        description: "Sua nota foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar nota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("project_notes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-notes", projectId] });
      toast({
        title: "Nota excluída",
        description: "Sua nota foi removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir nota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadAttachment = async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("note-attachments")
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("note-attachments")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return {
    notes,
    isLoading,
    addNote: addNote.mutate,
    updateNote: updateNote.mutate,
    deleteNote: deleteNote.mutate,
    uploadAttachment,
  };
};

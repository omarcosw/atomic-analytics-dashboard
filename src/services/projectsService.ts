import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { demoProjects } from "@/data/demoProjects";

export type ProjectRecord = Tables<"projects">;

type ProjectInsert = TablesInsert<"projects">;

export type CreateProjectInput = Omit<ProjectInsert, "id" | "created_at" | "updated_at">;

const DEMO_USER_ID = "demo-user";
const DEMO_STORAGE_KEY = "atomic-demo-projects";
const LOCAL_PROJECT_PREFIX = "atomic-projects-";

const createRandomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const isBrowser = () => typeof window !== "undefined";
const isDemoUser = (userId?: string) => userId === DEMO_USER_ID;

const getLocalProjectsKey = (userId: string) => `${LOCAL_PROJECT_PREFIX}${userId}`;

const loadLocalProjects = (userId: string): ProjectRecord[] => {
  if (!isBrowser() || !userId) return [];
  const stored = localStorage.getItem(getLocalProjectsKey(userId));
  if (!stored) return [];
  try {
    return JSON.parse(stored) as ProjectRecord[];
  } catch (error) {
    console.error("[loadLocalProjects] invalid JSON", error);
    return [];
  }
};

const saveLocalProjects = (userId: string, projects: ProjectRecord[]) => {
  if (!isBrowser() || !userId) return;
  localStorage.setItem(getLocalProjectsKey(userId), JSON.stringify(projects));
};

const loadAllLocalProjects = (): ProjectRecord[] => {
  if (!isBrowser()) return [];
  const projects: ProjectRecord[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCAL_PROJECT_PREFIX)) {
      const value = localStorage.getItem(key);
      if (!value) continue;
      try {
        const parsed = JSON.parse(value) as ProjectRecord[];
        projects.push(...parsed);
      } catch (error) {
        console.error("[loadAllLocalProjects] invalid JSON", error);
      }
    }
  }
  return projects;
};

const buildProjectRecord = (
  input: CreateProjectInput,
  overrides?: Partial<ProjectRecord>,
): ProjectRecord => {
  const timestamp = new Date().toISOString();
  return {
    id: createRandomId(),
    name: input.name,
    type: input.type ?? "launch",
    status: input.status ?? "preparing",
    is_active: input.is_active ?? true,
    public_slug: input.public_slug ?? null,
    start_date: input.start_date,
    end_date: input.end_date,
    goals: input.goals ?? {},
    created_at: timestamp,
    updated_at: timestamp,
    user_id: input.user_id,
    ...overrides,
  };
};

const mapDemoProjects = (): ProjectRecord[] => {
  const now = new Date();
  return demoProjects.map((project) => ({
    id: project.id,
    name: project.name,
    type: project.type,
    status: project.status,
    is_active: project.isActive,
    public_slug: project.publicSlug,
    created_at: project.lastUpdated.toISOString(),
    updated_at: project.lastUpdated.toISOString(),
    start_date: null,
    end_date: null,
    user_id: DEMO_USER_ID,
    goals: project.goals,
  }));
};

const loadDemoProjects = (): ProjectRecord[] => {
  if (!isBrowser()) return mapDemoProjects();
  const stored = localStorage.getItem(DEMO_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as ProjectRecord[];
    } catch (error) {
      console.error("[loadDemoProjects] invalid JSON", error);
    }
  }
  const seeded = mapDemoProjects();
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

const saveDemoProjects = (projects: ProjectRecord[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(projects));
};

const findProjectInStoredData = (projectId: string): ProjectRecord | null => {
  const demoProject = loadDemoProjects().find((project) => project.id === projectId);
  if (demoProject) return demoProject;

  const localProject = loadAllLocalProjects().find((project) => project.id === projectId);
  return localProject ?? null;
};

export const getStoredProjectById = (projectId: string): ProjectRecord | null => {
  if (!isBrowser()) return null;
  return findProjectInStoredData(projectId);
};

const createDemoProject = (input: CreateProjectInput): ProjectRecord => {
  const newProject = buildProjectRecord(input, { user_id: DEMO_USER_ID });
  const projects = loadDemoProjects();
  const updated = [newProject, ...projects];
  saveDemoProjects(updated);
  return newProject;
};

const createLocalProject = (input: CreateProjectInput): ProjectRecord => {
  const newProject = buildProjectRecord(input);
  const projects = loadLocalProjects(input.user_id);
  saveLocalProjects(input.user_id, [newProject, ...projects]);
  return newProject;
};

const updateLocalProject = (
  id: string,
  updates: Partial<Omit<ProjectInsert, "user_id">>,
  userId: string,
): ProjectRecord => {
  const projects = loadLocalProjects(userId);
  const updatedProjects = projects.map((project) =>
    project.id === id
      ? {
          ...project,
          ...updates,
          updated_at: new Date().toISOString(),
        }
      : project,
  );
  saveLocalProjects(userId, updatedProjects);
  const updatedProject = updatedProjects.find((project) => project.id === id);
  if (!updatedProject) {
    throw new Error("Projeto não encontrado (local)");
  }
  return updatedProject;
};

const deleteLocalProject = (id: string, userId: string) => {
  const projects = loadLocalProjects(userId).filter((project) => project.id !== id);
  saveLocalProjects(userId, projects);
};

export const fetchProjects = async (userId?: string): Promise<ProjectRecord[]> => {
  if (!userId) return [];

  if (isDemoUser(userId)) {
    return loadDemoProjects();
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchProjects] error:", error);
    return loadLocalProjects(userId);
  }

  return data as ProjectRecord[];
};

export const createProject = async (input: CreateProjectInput): Promise<ProjectRecord> => {
  if (isDemoUser(input.user_id)) {
    return createDemoProject(input);
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...input,
      goals: input.goals ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error("[createProject] error:", error);
    if (input.user_id) {
      return createLocalProject(input);
    }
    throw error;
  }

  return data as ProjectRecord;
};

export const updateProject = async (
  id: string,
  updates: Partial<Omit<ProjectInsert, "user_id">>,
  userId?: string,
): Promise<ProjectRecord> => {
  if (userId && isDemoUser(userId)) {
    const projects = loadDemoProjects();
    const updatedProjects = projects.map((project) =>
      project.id === id
        ? {
            ...project,
            ...updates,
            updated_at: new Date().toISOString(),
          }
        : project,
    );
    saveDemoProjects(updatedProjects);
    const updatedProject = updatedProjects.find((project) => project.id === id);
    if (!updatedProject) {
      throw new Error("Projeto não encontrado (demo)");
    }
    return updatedProject;
  }

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updateProject] error:", error);
    if (userId) {
      return updateLocalProject(id, updates, userId);
    }
    throw error;
  }

  return data as ProjectRecord;
};

export const deleteProject = async (id: string, userId?: string): Promise<void> => {
  if (userId && isDemoUser(userId)) {
    const projects = loadDemoProjects().filter((project) => project.id !== id);
    saveDemoProjects(projects);
    return;
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("[deleteProject] error:", error);
    if (userId) {
      deleteLocalProject(id, userId);
      return;
    }
    throw error;
  }
};
export const getProjectById = async (id: string): Promise<ProjectRecord | null> => {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("[getProjectById] error:", error);
    return findProjectInStoredData(id);
  }

  if (data) {
    return data as ProjectRecord;
  }

  return findProjectInStoredData(id);
};

export const generatePublicSlug = (projectId: string) => {
  const random = Math.random().toString(36).substring(2, 8);
  return `dash-${projectId}-${random}`;
};

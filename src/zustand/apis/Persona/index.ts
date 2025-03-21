import { create } from "zustand";
import { checkStatus, handleError } from "../../../apis/utils";
import {
  createPersonaApi,
  deletePersonaApi,
  getAvailablePersonasApi,
  getPersonaAvatarApi,
  postAvailablePersonasApi,
  updatePersonaApi,
} from "../../../apis/Persona";
import { PersonaModel } from "../../../apis/Persona/typings";

interface PersonaState {
  currentPersona: PersonaModel | null;
  personaList: PersonaModel[];
  getPersonaList: () => Promise<void>; // if admin, return all, if educator, return only educator, if user, return none
  postPersonaList: () => Promise<void>;
  createPersona: (personaInfo: PersonaModel) => Promise<void>;
  updatePersona: (personaInfo: PersonaModel) => Promise<void>;
  deletePersona: (personaId: string) => Promise<void>;
  getPersona: (chatId: string) => Promise<void>;
}

const initialStates = {
  currentPersona: null,
  personaList: [],
};

export const usePersonaStore = create<PersonaState>((set, get) => ({
  ...initialStates,
  getPersonaList: async () => {
    try {
      const response = checkStatus(await getAvailablePersonasApi());
      const personas = response.data.personas;
      set({ personaList: personas });
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
  postPersonaList: async () => {
    try {
      const response = checkStatus(await postAvailablePersonasApi());
      const personas = response.data.personas;
      set({ personaList: personas });
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
  createPersona: async (personaInfo: PersonaModel) => {
    try {
      const response = checkStatus(await createPersonaApi(personaInfo));
      get().postPersonaList();
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
  updatePersona: async (personaInfo: PersonaModel) => {
    try {
      const response = checkStatus(await updatePersonaApi(personaInfo));
      get().postPersonaList();
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
  deletePersona: async (personaId: string) => {
    try {
      const response = checkStatus(await deletePersonaApi(personaId));
      get().postPersonaList();
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
  getPersona: async (chatId: string) => {
    try {
      const response = checkStatus(await getPersonaAvatarApi(chatId));
      const persona = response.data.personas[0];
      set({ currentPersona: persona });
      return;
    } catch (error) {
      handleError(error);
      return;
    }
  },
}));

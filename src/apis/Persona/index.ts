import { HTTPMethod } from "../typings";
import {
  createPersonaUrl,
  deletePersonaUrl,
  getPersonasUrl,
  updatePersonaUrl,
} from "../urls";
import { fetchWithAuth } from "../utils";
import { GetPersonaResponseModel, PersonaModel } from "./typings";

export const getAvailablePersonasApi = async () => {
  // Return all
  return (
    await fetchWithAuth(getPersonasUrl, {
      method: HTTPMethod.GET,
    })
  ).json() as unknown as GetPersonaResponseModel;
};

export const postAvailablePersonasApi = async () => {
  // Return personas based on user role
  return (
    await fetchWithAuth(getPersonasUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
  ).json() as unknown as GetPersonaResponseModel;
};

export const updatePersonaApi = async (personaInfo: PersonaModel) => {
  const formData = new FormData();

  formData.append(
    "personaInfo",
    JSON.stringify({
      ...personaInfo,
      avatar: undefined,
      documentSrc: undefined,
    })
  );

  // Append the avatar as a file blob (if one is provded)
  if (personaInfo.personaAvatar !== undefined) {
    const blob = await (await fetch(personaInfo.personaAvatar)).blob(); // Convert base64 to Blob
    formData.append(
      "personaAvatar",
      blob,
      `${personaInfo.personaName}_avatar.png`
    ); // You can change the filename if needed
  }

  // Similarly, append the document as a file blob (if one is provided)
  if (personaInfo.documentSrc !== undefined) {
    const blob = await (await fetch(personaInfo.documentSrc)).blob(); // Convert base64 to Blob
    formData.append(
      "documentSrc",
      blob,
      `${personaInfo.personaName}_document.zip`
    ); // You can change the filename if needed
  }

  return (
    await fetchWithAuth(updatePersonaUrl, {
      method: HTTPMethod.POST,
      body: formData,
    })
  ).json() as unknown as GetPersonaResponseModel;
};

export const deletePersonaApi = async (personaId: string) => {
  return (
    await fetchWithAuth(deletePersonaUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ personaId }),
    })
  ).json() as unknown as GetPersonaResponseModel;
};

export const createPersonaApi = async (personaInfo: PersonaModel) => {
  return (
    await fetchWithAuth(createPersonaUrl, {
      method: HTTPMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personaInfo),
    })
  ).json() as unknown as GetPersonaResponseModel;
};

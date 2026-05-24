import npcPromptProfilesData from "../../prompts/npcProfiles.json";

export type NpcPromptProfile = {
  npcId: string;
  name: string;
  eventIds: string[];
  voice: string;
  motive: string;
  limitation: string;
  mockReplies: string[];
};

export const npcPromptProfiles = npcPromptProfilesData as NpcPromptProfile[];

export const getNpcProfile = (npcId: string) =>
  npcPromptProfiles.find((profile) => profile.npcId === npcId);

export const getNpcName = (npcId: string) => getNpcProfile(npcId)?.name ?? npcId;

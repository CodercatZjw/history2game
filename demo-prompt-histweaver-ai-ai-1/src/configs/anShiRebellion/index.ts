import type { HistoricalGameConfig } from "../../types";
import { assets } from "./assets";
import { endings } from "./endings";
import { meta } from "./meta";
import { nodes } from "./nodes";
import { npcs } from "./npcs";
import { randomEvents } from "./randomEvents";
import { roles } from "./roles";
import { defaultState, stateSchema } from "./stateSchema";
import { timeline } from "./timeline";

export const anShiRebellionConfig: HistoricalGameConfig = {
  ...meta,
  assets,
  timeline,
  roles,
  npcs,
  nodes,
  stateSchema,
  defaultState,
  randomEvents,
  endings,
};

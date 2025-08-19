import { IWorldTile } from "./IWorldTile.js";

export interface IWorld {
  campaignId: number;   // שייך לאיזה קמפיין
  seed: string;         // ליצירה דטרמיניסטית
  size: { rows: number; cols: number };

  tiles: IWorldTile[];

  rules: {
    wrap: boolean;          // האם העולם "עוטף" בקצוות (טורוס)
    waterBlocks: boolean;   // האם מים חוסמים תנועה
  };
}

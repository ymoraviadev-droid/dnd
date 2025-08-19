import { DbRecord } from "../private/DbRecord.js";

export interface ICampaign extends DbRecord {
    name: string;               // שם הקמפיין
    ownerId: number;            // מי פתח את הקמפיין
    leaderId: number;           // מנהיג נוכחי (ברירת מחדל = ownerId)
    playerIds: number[];        // שחקנים בקמפיין
    invitedIds?: number[];      // מוזמנים שטרם הצטרפו

    status: "draft" | "waiting" | "active" | "paused_afk" | "ended";

    // מטא של העולם (המפה המלאה נשמרת במסמך נפרד)
    world: {
        seed: string;
        size: { rows: number; cols: number };
        currentTile: { row: number; col: number };
    };

    main_prompt: string;        // פרומפט פתיחה/לור של הקמפיין
}

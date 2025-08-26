export type CreateCampaignInput = {
    name: string;
    ownerId: number;
    invitedIds?: number[];
};

export type CreateCampaignRow = {
    name: string;
    ownerId: number;
    leaderId: number;
    playerIds: number[];
    invitedIds: number[];
    status: 'waiting' | 'active' | 'ended';
    world: {
        seed: string;
        size: { rows: number; cols: number };
        currentTile: { row: number; col: number };
    };
    main_prompt: string;
};

export type CreateWorldRow = {
    campaignId: number;
    data: unknown;
};

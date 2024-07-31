export interface TgTask {
    id: number;
    taskName: string;
    description: string;
    imageUrl: string;
    status: string;
    type: string;
    reward: string;
    startDate: string;
    endDate: string;
    taskNameCn: string;
    descriptionCn: string;
    startLink: string;
    createTime: string;
    updateTime: string;
  }
  
  export interface TgVoteQuest {
    id: number;
    questId: number;
    optionDescription: string;
    currentVotes: number;
    voteUsers: number;
    createTime: string;
    updateTime: string;
    optionName: string;
  }
  
  export type GetQuestsResponse = {
    code: number;
    msg: string;
    data: TgTask[];
  };
  
  export type GetQuestResponse = {
    code: number;
    msg: string;
    data: TgTask & { votes: TgVoteQuest[] };
  };
  
  export type AddQuestResponse = {
    code: number;
    msg: string;
    data: TgTask;
  };
  
  export type UpdateQuestResponse = {
    code: number;
    msg: string;
    data: TgTask;
  };
  
  export interface AddQuestParams {
    taskName: string;
    description: string;
    imageUrl: string;
    status: string;
    type: string;
    reward: string;
    startDate: string;
    endDate: string;
    taskNameCn: string;
    descriptionCn: string;
    startLink: string;
    optionName?: string;
    optionDescription?: string;
  }
  
  export interface UpdateQuestParams extends AddQuestParams {
    id: number;
  }
  
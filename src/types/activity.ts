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
  
  export type GetActivitiesResponse = {
    code: number;
    msg: string;
    data: TgTask[];
  };
  
  export type GetActivityResponse = {
    code: number;
    msg: string;
    data: TgTask & { votes: TgVoteQuest[] };
  };
  
  export type AddActivityResponse = {
    code: number;
    msg: string;
    data: TgTask;
  };
  
  export type UpdateActivityResponse = {
    code: number;
    msg: string;
    data: TgTask;
  };
  
  export interface AddActivityParams {
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
  
  export interface UpdateActivityParams extends AddActivityParams {
    id: number;
  }
  
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

export interface TgQuest {
  id: number;
  task_name: string;
  description: string;
  image_url: string;
  type: string;
  reward: string;
  start_date: string;
  end_date: string;
  vote_price: number;
  vote_limit: number;
}

export interface TgVoteQuest {
  id: number;
  quest_id: number;
  option_description: string;
  current_votes: number;
  vote_users: number;
  create_time: string;
  update_time: string;
  option_name: string;
}

export type GetQuestsResponse = {
  code: number;
  msg: string;
  data: TgQuest[];
};

export type GetQuestResponse = {
  code: number;
  msg: string;
  data: TgQuest & { votes: TgVoteQuest[] };
};

export type AddQuestResponse = {
  code: number;
  msg: string;
  data: TgQuest;
};

export type UpdateQuestResponse = {
  code: number;
  msg: string;
  data: TgQuest;
};

export interface AddQuestParams {
  task_name: string;
  description: string;
  image_url: string;
  type: string;
  reward: string;
  start_date: string;
  end_date: string;
  vote_price: number;
  vote_limit: number;
  votes?: { option_name: string; option_description: string }[];
}

export interface UpdateQuestParams extends AddQuestParams {
  id: number;
}

import { Request, Response } from 'express';
import { TgQuest, TgVoteQuest } from '@/types/quest';

let activities: TgQuest[] = [
  {
    id: 1,
    task_name: '任务1',
    description: '任务1的描述',
    image_url: 'https://via.placeholder.com/150',
    type: 'vote',
    reward: '奖励1',
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-01-31T23:59:59Z',
    vote_price: 10,
    vote_limit: 100,
  },
  {
    id: 2,
    task_name: '任务2',
    description: '任务2的描述',
    image_url: 'https://via.placeholder.com/150',
    type: 'custom',
    reward: '奖励2',
    start_date: '2024-02-01T00:00:00Z',
    end_date: '2024-02-28T23:59:59Z',
    vote_price: 0,
    vote_limit: 0,
  },
];

let voteQuests: TgVoteQuest[] = [
  {
    id: 1,
    quest_id: 1,
    option_description: '选项1的描述',
    current_votes: 100,
    vote_users: 50,
    create_time: '2024-01-01T00:00:00Z',
    update_time: '2024-01-01T00:00:00Z',
    option_name: '选项1',
  },
  {
    id: 2,
    quest_id: 1,
    option_description: '选项2的描述',
    current_votes: 200,
    vote_users: 100,
    create_time: '2024-01-01T00:00:00Z',
    update_time: '2024-01-01T00:00:00Z',
    option_name: '选项2',
  },
];

function getQuests(req: Request, res: Response) {
  res.send({ code: 200, msg: 'success', data: activities });
}

function getQuest(req: Request, res: Response) {
  const { id } = req.params;
  const quest = activities.find((item) => item.id === parseInt(id, 10));
  if (quest) {
    const votes = voteQuests.filter((vote) => vote.quest_id === quest.id);
    res.send({ code: 200, msg: 'success', data: { ...quest, votes } });
  } else {
    res.status(404).send({ message: 'Quest not found' });
  }
}

function addQuest(req: Request, res: Response) {
  const {
    task_name,
    description,
    image_url,
    type,
    reward,
    start_date,
    end_date,
    vote_price,
    vote_limit,
    votes,
  } = req.body;
  const id = activities.length + 1;
  const newQuest: TgQuest = {
    id,
    task_name,
    description,
    image_url,
    type,
    reward,
    start_date,
    end_date,
    vote_price,
    vote_limit,
  };
  activities.push(newQuest);
  if (type === 'vote' && votes) {
    votes.forEach((vote: { option_name: string; option_description: string }) => {
      const voteId = voteQuests.length + 1;
      const newVoteQuest: TgVoteQuest = {
        id: voteId,
        quest_id: id,
        option_description: vote.option_description,
        current_votes: 0,
        vote_users: 0,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
        option_name: vote.option_name,
      };
      voteQuests.push(newVoteQuest);
    });
  }
  res.send({ code: 200, msg: 'success', data: newQuest });
}

function updateQuest(req: Request, res: Response) {
  const {
    id,
    task_name,
    description,
    image_url,
    type,
    reward,
    start_date,
    end_date,
    vote_price,
    vote_limit,
    votes,
  } = req.body;
  const index = activities.findIndex((item) => item.id === parseInt(id, 10));
  if (index !== -1) {
    activities[index] = {
      ...activities[index],
      task_name,
      description,
      image_url,
      type,
      reward,
      start_date,
      end_date,
      vote_price,
      vote_limit,
    };
    if (type === 'vote' && votes) {
      voteQuests = voteQuests.filter((vote) => vote.quest_id !== parseInt(id, 10)); // 删除旧的投票选项
      votes.forEach((vote: { option_name: string; option_description: string }) => {
        const voteId = voteQuests.length + 1;
        const newVoteQuest: TgVoteQuest = {
          id: voteId,
          quest_id: parseInt(id, 10),
          option_description: vote.option_description,
          current_votes: 0,
          vote_users: 0,
          create_time: new Date().toISOString(),
          update_time: new Date().toISOString(),
          option_name: vote.option_name,
        };
        voteQuests.push(newVoteQuest);
      });
    }
    res.send({ code: 200, msg: 'success', data: activities[index] });
  } else {
    res.status(404).send({ message: 'Quest not found' });
  }
}

export default {
  'GET /api/quests': getQuests,
  'GET /api/quest/:id': getQuest,
  'POST /api/quest': addQuest,
  'PUT /api/quest': updateQuest,
};

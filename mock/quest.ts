import { Request, Response } from 'express';
import { TgTask, TgVoteQuest } from '@/types/quest';

let activities: TgTask[] = [
  {
    id: 1,
    taskName: '任务1',
    description: '任务1的描述',
    imageUrl: 'https://via.placeholder.com/150',
    status: 'active',
    type: 'vote',
    reward: '奖励1',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    taskNameCn: '任务1',
    descriptionCn: '任务1的描述',
    startLink: 'https://example.com/start',
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    taskName: '任务2',
    description: '任务2的描述',
    imageUrl: 'https://via.placeholder.com/150',
    status: 'inactive',
    type: 'custom',
    reward: '奖励2',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-28T23:59:59Z',
    taskNameCn: '任务2',
    descriptionCn: '任务2的描述',
    startLink: 'https://example.com/start2',
    createTime: '2024-02-01T00:00:00Z',
    updateTime: '2024-02-01T00:00:00Z',
  },
];

let voteQuests: TgVoteQuest[] = [
  {
    id: 1,
    questId: 1,
    optionDescription: '选项1的描述',
    currentVotes: 100,
    voteUsers: 50,
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
    optionName: '选项1',
  },
  {
    id: 2,
    questId: 1,
    optionDescription: '选项2的描述',
    currentVotes: 200,
    voteUsers: 100,
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
    optionName: '选项2',
  },
];

function getQuests(req: Request, res: Response) {
  res.send({ code: 200, msg: 'success', data: activities });
}

function getQuest(req: Request, res: Response) {
  const { id } = req.params;
  const quest = activities.find((item) => item.id === parseInt(id, 10));
  if (quest) {
    const votes = voteQuests.filter((vote) => vote.questId === quest.id);
    res.send({ code: 200, msg: 'success', data: { ...quest, votes } });
  } else {
    res.status(404).send({ message: 'Quest not found' });
  }
}

function addQuest(req: Request, res: Response) {
  const {
    taskName,
    description,
    imageUrl,
    status,
    type,
    reward,
    startDate,
    endDate,
    taskNameCn,
    descriptionCn,
    startLink,
    optionName,
    optionDescription,
  } = req.body;
  const id = activities.length + 1;
  const newQuest: TgTask = {
    id,
    taskName,
    description,
    imageUrl,
    status,
    type,
    reward,
    startDate,
    endDate,
    taskNameCn,
    descriptionCn,
    startLink,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  };
  activities.push(newQuest);
  if (type === 'vote') {
    const voteId = voteQuests.length + 1;
    const newVoteQuest: TgVoteQuest = {
      id: voteId,
      questId: id,
      optionDescription,
      currentVotes: 0,
      voteUsers: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      optionName,
    };
    voteQuests.push(newVoteQuest);
  }
  res.send({ code: 200, msg: 'success', data: newQuest });
}

function updateQuest(req: Request, res: Response) {
  const {
    id,
    taskName,
    description,
    imageUrl,
    status,
    type,
    reward,
    startDate,
    endDate,
    taskNameCn,
    descriptionCn,
    startLink,
    optionName,
    optionDescription,
  } = req.body;
  const index = activities.findIndex((item) => item.id === parseInt(id, 10));
  if (index !== -1) {
    activities[index] = {
      ...activities[index],
      taskName,
      description,
      imageUrl,
      status,
      type,
      reward,
      startDate,
      endDate,
      taskNameCn,
      descriptionCn,
      startLink,
      updateTime: new Date().toISOString(),
    };
    if (type === 'vote') {
      const voteIndex = voteQuests.findIndex((vote) => vote.questId === parseInt(id, 10));
      if (voteIndex !== -1) {
        voteQuests[voteIndex] = {
          ...voteQuests[voteIndex],
          optionName,
          optionDescription,
          updateTime: new Date().toISOString(),
        };
      } else {
        const voteId = voteQuests.length + 1;
        const newVoteQuest: TgVoteQuest = {
          id: voteId,
          questId: parseInt(id, 10),
          optionDescription,
          currentVotes: 0,
          voteUsers: 0,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          optionName,
        };
        voteQuests.push(newVoteQuest);
      }
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

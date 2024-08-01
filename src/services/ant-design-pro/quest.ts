import { request } from '@umijs/max';
import {
  GetQuestsResponse,
  GetQuestResponse,
  AddQuestParams,
  AddQuestResponse,
  UpdateQuestParams,
  UpdateQuestResponse,
} from '@/types/quest';

/** 获取活动列表: GET /api/quests */
export async function getQuests() {
  return request<GetQuestsResponse>(`/api/quests`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/** 获取活动详情: GET /api/quest/:id */
export async function getQuest(id: string) {
  return request<GetQuestResponse>(`/api/quest/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/** 添加活动: POST /api/quest */
export async function addQuest(params: AddQuestParams) {
  return request<AddQuestResponse>(`/api/quest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/** 更新活动: PUT /api/quest */
export async function updateQuest(params: UpdateQuestParams) {
  return request<UpdateQuestResponse>(`/api/quest`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

import { request } from '@umijs/max';
import { GetActivitiesResponse, GetActivityResponse, AddActivityParams, AddActivityResponse, UpdateActivityParams, UpdateActivityResponse } from '@/types/activity';

const apiBaseUrl = process.env.REACT_APP_API_URL || '';

/** 获取活动列表: GET /api/activities */
export async function getActivities() {
  return request<GetActivitiesResponse>(`${apiBaseUrl}/api/activities`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/** 获取活动详情: GET /api/activity/:id */
export async function getActivity(id: string) {
  return request<GetActivityResponse>(`${apiBaseUrl}/api/activity/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/** 添加活动: POST /api/activity */
export async function addActivity(params: AddActivityParams) {
  return request<AddActivityResponse>(`${apiBaseUrl}/api/activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/** 更新活动: PUT /api/activity */
export async function updateActivity(params: UpdateActivityParams) {
  return request<UpdateActivityResponse>(`${apiBaseUrl}/api/activity`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

import { AddActivityParams, AddActivityResponse, GetActivityResponse, UpdateActivityParams, UpdateActivityResponse } from '@/types/activity';
import { request } from '@umijs/max';

const apiBaseUrl = 'http://admin-bff.data.worldbrains.org';



/** 获取活动详情: GET /api/activity/:id */
export async function getActivity(id: string) {
  const token = localStorage.getItem('token');
  return request<GetActivityResponse>(`${apiBaseUrl}/api/activity/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-App-Id': `admin-bff`,
    },
  });
}

/** 添加活动: POST /api/activity */
export async function addActivity(params: AddActivityParams) {
  const token = localStorage.getItem('token');
  return request<AddActivityResponse>(`${apiBaseUrl}/api/activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-App-Id': `admin-bff`,
    },
    data: params,
  });
}

/** 更新活动: PUT /api/activity */
export async function updateActivity(params: UpdateActivityParams) {
  const token = localStorage.getItem('token');
  return request<UpdateActivityResponse>(`${apiBaseUrl}/api/activity`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-App-Id': `admin-bff`,
    },
    data: params,
  });
}

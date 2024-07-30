// src/services/hierarchyList.ts
import { request } from '@umijs/max';

const apiBaseUrl = 'http://admin-bff.data.worldbrains.org';

export interface HierarchyData {
  user_id: number;
  total_nts: number;
  total_user: number;
  ancestor_path: string;
  total_activat_user: number;
  invite_count: number;
  invite_activat_count: number;
  nts: number;
  total_block_nts: number;
  total_block_user: number;
  email?: string;
  phone?: string;
  level?: number;

  // Customized Data
  children?: HierarchyData[];
}

export interface FetchDownloadUrl {
  url: string;
}

export type GetDownloadUrlResponse = {
  code: number;
  msg: string;
  data: FetchDownloadUrl;
};

export type GetUserHierarchyDataResponse = {
  code: number;
  msg: string;
  data: GetUserHierarchyData;
};

export interface GetUserHierarchyData {
  hierarchy: HierarchyData;
  invite_user_hierarchy: HierarchyData[];
}

export interface FetchHierarchyListParams {
  userId?: number;
}

export interface FetchHierarchyListOptions {
  [key: string]: any;
}

/** 获取层级数据: GET /v1/admin/hierarchy */
export async function fetchHierarchyList(
  params?: FetchHierarchyListParams,
  options?: FetchHierarchyListOptions,
) {
  const token = localStorage.getItem('token');
  return request<GetUserHierarchyDataResponse>(`${apiBaseUrl}/v1/admin/hierarchy`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-App-Id': `admin-bff`,
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function fetchDownloadUrl(
  params?: FetchHierarchyListParams,
  options?: FetchHierarchyListOptions,
) {
  const token = localStorage.getItem('token');
  return request<GetDownloadUrlResponse>(`${apiBaseUrl}/v1/admin/hierarchy/export`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-App-Id': `admin-bff`,
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

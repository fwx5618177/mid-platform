// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function getUserInfo() {
  return request(`/api/currentUser`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

export async function login(data: { username: string; password: string }) {
  return request(`/api/login`, {
    method: 'POST',
    data,
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

const apiBaseUrl = 'http://admin-bff.data.worldbrain.me';

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>(`${apiBaseUrl}/api/login/`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

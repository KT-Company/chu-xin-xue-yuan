import { request } from './index';

export function getWarnList(params = {}) {
  return request(`/warnList`, params, 'post');
}

export function getTagData(params = { deviceCode: '201561293' }) {
  return request(`/tagData`, params, 'post');
}

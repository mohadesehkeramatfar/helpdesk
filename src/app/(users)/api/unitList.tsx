import { request } from '@/lib/services/baseURL';
import { API_ENDPOINTS } from '@/lib/services/endpoints';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export const useGetBuildingsList = () => {
  return useSWR(
    API_ENDPOINTS.GET_BUILDINGS_LIST,
    async (url) => await request(url, 'GET', {}, false),
  );
};
export const useGetFacingSideList = () => {
  return useSWR(
    API_ENDPOINTS.GET_FACING_SIDE,
    async (url) => await request(url, 'GET', {}, false),
  );
};

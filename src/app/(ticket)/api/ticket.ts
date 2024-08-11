import { request } from '@/lib/services/baseURL';
import { API_ENDPOINTS } from '@/lib/services/endpoints';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export const useGetParentCategoriesList = () => {
  return useSWR(
    API_ENDPOINTS.GET_PARENT_CATEGORY_TICKET_LIST,
    async (url) => await request(url, 'GET', {}, true),
  );
};

export const useGetSubCategoriesList = () => {
  return useSWRMutation(
    API_ENDPOINTS.GET_SUB_CATEGORY_TICKET_LIST,
    async (url, { arg }) => await request(`${url}${arg.id}`, 'GET', {}, true),
  );
};

export const usePostUnitTicketSubmit = () => {
  return useSWRMutation(
    API_ENDPOINTS.POST_UNIT_TICKET_SUBMIT,
    async (url, { arg }) => await request(`${url}`, 'POST', arg.data, true),
  );
};

export const usePostUnitTicketPostSubmit = () => {
  return useSWRMutation(
    API_ENDPOINTS.POST_UNIT_TICKET_POST_SUBMIT,
    async (url, { arg }) => await request(`${url}`, 'POST', arg.data, true),
  );
};

export const useGetUnitTicketList = () => {
  return useSWR(
    API_ENDPOINTS.GET_UNIT_TICKET_LIST,
    async (url) => await request(url, 'GET', {}, true),
  );
};

export const useTicketDetail = () => {
  return useSWRMutation(
    API_ENDPOINTS.GET_UNIT_TICKET_Detail,
    async (url, { arg }) => await request(`${url}${arg.id}`, 'GET', {}, true),
  );
};

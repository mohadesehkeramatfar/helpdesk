import { request } from '@/lib/services/baseURL';
import { API_ENDPOINTS } from '@/lib/services/endpoints';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export const useGetParentCategoriesList = () => {
  return useSWRMutation(
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

export const useUnitTicketDetail = () => {
  return useSWRMutation(
    API_ENDPOINTS.GET_UNIT_TICKET_Detail,
    async (url, { arg }) => await request(`${url}${arg.id}`, 'GET', {}, true),
  );
};
export const useTicketPostList = () => {
  return useSWRMutation(
    API_ENDPOINTS.GET_UNIT_TICKET_POST_LIST,
    async (url, { arg }) => await request(`${url}${arg.id}`, 'GET', {}, true),
  );
};
// GET_UNIT_TICKET_POST_LIST
// /ticket/unit_ticket_ticket_posts_list/{id}/

export const useGetTicketTimeline = () => {
  return useSWRMutation(
    API_ENDPOINTS.GET_TICKET_TIMELINE,
    async (url, { arg }) => await request(`${url}${arg}`, 'GET', {}, true),
  );
};

export const usePatchTicketPostAdd = () => {
  return useSWRMutation(
    API_ENDPOINTS.PATCH_TICKET_POST_ASSET_ADD,
    async (url, { arg }: { arg: any }) =>
      await request(`${url}${arg.id}/`, 'PATCH', arg.data, true, true),
  );
};

export const useDeleteTicket = () => {
  return useSWRMutation(
    API_ENDPOINTS.DELETE_TICKET,
    async (url, { arg }) => await request(`${url}${arg}`, 'DELETE', {}, true),
  );
};

export const useDeletePostTicket = () => {
  return useSWRMutation(
    API_ENDPOINTS.DELETE_POST_TICKET,
    async (url, { arg }) => await request(`${url}${arg}`, 'DELETE', {}, true),
  );
};

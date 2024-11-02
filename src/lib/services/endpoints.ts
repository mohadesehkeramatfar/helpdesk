export const API_ENDPOINTS = {
  //* AUTH
  POST_SUBMIT_LOGIN: '/user/submit_login/',
  POST_VALIDATE_OTP: '/user/validate_otp/',
  GET_SEND_OTP: '/user/send_otp/',
  POST_UNIT_LOGIN: '/user/user_login/',
  POST_UNIT_REGISTER: '/user/submit_registration/',

  WHO_AM_I: '/user/whoami/',
  REFRESH_TOKEN: '/api/token/refresh/',

  // *BUILDING
  GET_BUILDINGS_LIST: '/building/buildings_list/',
  GET_FACING_SIDE: '/building/facing_sides_list/',
  //* TICKET
  GET_PARENT_CATEGORY_TICKET_LIST: '/ticket/parent_categories_list/',
  GET_SUB_CATEGORY_TICKET_LIST: '/ticket/sub_categories_list/',
  POST_UNIT_TICKET_SUBMIT: '/ticket/user_ticket_submit/',
  POST_UNIT_TICKET_POST_SUBMIT: '/ticket/user_ticket_post_submit/',
  GET_UNIT_TICKET_LIST: '/ticket/user_tickets_list/',
  GET_UNIT_TICKET_Detail: '/ticket/user_ticket_detail/',
  GET_UNIT_TICKET_POST_LIST: '/ticket/user_ticket_ticket_posts_list/',
  GET_TICKET_TIMELINE: '/ticket/ticket_timeline/',
  DELETE_TICKET: '/ticket/ticket_delete/',
  DELETE_POST_TICKET: '/ticket/ticket_post_delete/',
  GET_TICKET_TIME_INTERVALS_LIST: '/ticket/ticket_time_intervals_list/',
  GET_VALID_TICKET_TIME_INTERVALS: '/ticket/get_valid_ticket_time_intervals/',
  PATCH_TICKET_POST_ASSET_ADD: '/ticket/ticket_post_asset_add/',
  GET_USER_TICKETS_REPORT: '/ticket/user_tickets_report/',
};

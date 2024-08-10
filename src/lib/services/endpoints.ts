export const API_ENDPOINTS = {
  //* AUTH
  POST_SUBMIT_LOGIN: '/users/submit_login/',
  POST_VALIDATE_OTP: '/users/validate_otp/',
  GET_SEND_OTP: '/users/send_otp/',
  POST_UNIT_LOGIN: '/users/unit_login/',
  POST_UNIT_REGISTER: '/users/unit_register/',
  GET_BUILDINGS_LIST: '/users/buildings_list/',
  GET_FACING_SIDE: '/users/facing_sides_list/',
  WHO_AM_I: '/users/whoami/',
  REFRESH_TOKEN: '/api/token/refresh/',

  //* TICKET
  GET_PARENT_CATEGORY_TICKET_LIST: '/ticket/parent_categories_list/',
  GET_SUB_CATEGORY_TICKET_LIST: '/ticket/sub_categories_list/',
  POST_UNIT_TICKET_SUBMIT: '/ticket/unit_ticket_submit/',
  POST_UNIT_TICKET_POST_SUBMIT: '/ticket/unit_ticket_post_submit/',
  GET_UNIT_TICKET_LIST: '/ticket/unit_tickets_list/',
  GET_UNIT_TICKET_Detail: '/ticket/unit_ticket_detail/',
  //
};

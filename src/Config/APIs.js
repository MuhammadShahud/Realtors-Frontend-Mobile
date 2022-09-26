// const base_url = 'http://202.142.180.147:90/realtor/api/';
// export const Img_url = 'http://202.142.180.147:90/realtor/public/images/';
const base_url = 'https://www.realtorschoiceproducts.com/api/';
export const Img_url = 'https://www.realtorschoiceproducts.com/public/images/';

const APIs = {
  Signup: base_url + 'register',
  Login: base_url + 'login',
  ForgotPassword: base_url + 'forget-password',
  EditProfile: base_url + 'update',
  SocialLogin: base_url + 'social/login',
  Countries: base_url + 'countries',
  Cities: base_url + 'cities',
  GetRelators: base_url + 'search',
  GetUserData: base_url + 'edit',
  State: (country_id, country_code, flag) =>
    `${base_url}states/${country_id}/${country_code}/${flag}`,
  ChangePassword: user_id => `${base_url}changePassword/${user_id}`,
  ContactUs: base_url + 'contact',
  GetNotifications: page_number =>
    base_url + `notifications?page=${page_number}`,
  notify: `${base_url}notify`,
  termsAndCondition: `${base_url}terms`,
  isReadNotifciation: `${base_url}isRead`,
  languages: `${base_url}language`,
  speciality: `${base_url}speciality`,
  designation: `${base_url}designation`,
  Inbox: `${base_url}chatIndex`,
  SendMessage: `${base_url}message/send`,
  Logout: `${base_url}logout`,
  chatInbox: `${base_url}chatIndex`,
  messageSend: `${base_url}message/send`,
  chatlistCheck: `${base_url}chatlistCheck`,
  viewChatList: (user_id, page) =>
    `${base_url}viewChatlist/${user_id}?page=${page}`,
  getUpdatedUser: `${base_url}getUpdatedUser`,
};
export default APIs;

//type
//userId,
//message

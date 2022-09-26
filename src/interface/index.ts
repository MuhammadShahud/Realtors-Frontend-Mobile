/* eslint-disable prettier/prettier */
export interface ChangePasswordProps {
  old_password: string;
  password: string;
  confirm_password: any;
  successCallBack: () => void;
  errorCallBack: () => void;
}

export interface ContactUsFormProps {
  type: string;
  title: string;
  description: any;
  successCallBack: () => void;
  errorCallBack: () => void;
}


export interface DispatchActionType  { type: string; payload: any; }
import {REALTOR} from '../action_types';

const RealtorAction = {
  Realtor: (data: any) => {
    return {
      type: REALTOR,
      payload: data,
    };
  },
};

export default RealtorAction;

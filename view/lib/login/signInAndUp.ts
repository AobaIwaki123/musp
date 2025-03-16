import type { User as FirebaseUser } from '@firebase/auth';
import { api } from '@/client/api';
import type { PostUserRequestType } from '@/client/client';
import { storage } from '@/helper/localStorageHelper';

export const signInOrUp = async (firebaseUser: FirebaseUser) => {
  try {
    console.log('firebaseUser', firebaseUser);
    const google_id = firebaseUser.uid;

    const data: PostUserRequestType = {
      google_id,
    };

    console.log(data);
    const res = await api.postUsers(data);
    console.log(res);

    const user_id = res.user_id;
    storage.set('userID', user_id);

    toRoot();
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

const toRoot = () => {
  window.location.href = '/';
};

import type { User as FirebaseUser } from '@firebase/auth';
import { api } from '@/client/api';
import type { PostUserRequestType } from '@/client/client';
import { storage } from '@/helper/localStorageHelper';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export const signInOrUp = async (firebaseUser: FirebaseUser) => {
  try {
    const google_id = firebaseUser.uid;

    const data: PostUserRequestType = {
      google_id,
    };

    const res = await api.postUsers(data, {
      headers: { 'X-API-KEY': apiKey },
    });

    const user_id = res.user_id;
    storage.set('userID', user_id);
    storage.set('userIcon', firebaseUser.photoURL);

    toRoot();
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

const toRoot = () => {
  window.location.href = '/';
};

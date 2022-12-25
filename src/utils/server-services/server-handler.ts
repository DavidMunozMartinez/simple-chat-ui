import { API_URL } from '../constants'
import { AppUser } from './user-server.service';

export function serverSignIn(authId: string, email: string): Promise<string> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      email,
      authId,
    })
  }
  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/sign-in', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then(data => {
        success ? resolve(data) : reject(data);
      })
      .catch(reject);
  });
}

export function queryGlobalContacts(searchTerm: string): Promise<AppUser[]> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      searchTerm
    })
  }

  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/query-contacts', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then((data) => {
        success ? resolve(data) : reject(data);
      })
  });
}

export type DefaultResponse = {
  success: boolean;
}
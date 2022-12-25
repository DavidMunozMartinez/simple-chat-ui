import { API_URL } from "../constants";
import { DefaultResponse } from "./server-handler";

export function getUserId(authId: string): Promise<AppUser> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      authId
    })
  };  
  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/get-user-id', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then((data) => {
        success ? resolve(data) : reject(data)
      });
  });
}

export type UserContactsData = {
  contacts: AppUser[],
  receivedRequests: AppUser[],
  sentRequests: string[],
}
export function getUserContacts(user: AppUser): Promise<UserContactsData> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      _id: user._id
    })
  };

  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/get-user-contacts', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then((data) => {
        success ? resolve(data) : reject(data);
      })
  });
}

export function acceptFriendRequest(from: string, to: string): Promise<DefaultResponse> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      from,
      to
    })
  };

  return new Promise((resolve, reject) => {
    let success = true;
    fetch(API_URL + '/accept-friend-request', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then(data => {
        success ? resolve(data) : reject(data);
      });
      
  });
}

export function sendFriendRequest(from: string, to: string): Promise<string[]> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
    })
  };

  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/send-friend-request', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then(data => {
        success ? resolve(data) : reject(data);
      })
  });
}

export function updateUserProfile(_id: string, name: string): Promise<DefaultResponse> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      _id,
      name
    })
  };

  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/update-user', config)
      .then(res => {
        success = res.ok;
        return res.json()
      })
      .then(data => {
        success ? resolve(data) : reject(data);
      })
  });
} 

export function updateUserToken(_id: string, token: string): Promise<DefaultResponse> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      _id,
      token
    })
  };

  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/update-user-token', config)
      .then(res => {
        success = res.ok;
        return res.json()
      })
      .then(data => {
        success ? resolve(data) : reject(data);
      })
  });
}


export type AppUser = {
  _id: string,
  email: string,
  name?: string,
  contacts?: AppUser[],
  receivedRequests?: AppUser[],
  sentRequests?: string[],
}

import { API_URL } from './constants'

type AppUser = {
  email: string,
  id: string,
}

export function getUserContacts(user: AppUser): Promise<never[]> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      id: user.id
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

export function serverSignIn(id: string, email: string) {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      email,
      id
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

export function queryGlobalContacts(searchTerm: string) {
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

export function addContact(contactId: string) {
  const config: RequestInit = {
    method: 'GET',
    body: JSON.stringify({
      contactId,
    })
  };

  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/add-user-contacts', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then(data => {
        success ? resolve(data) : reject(data);
      })
  });
}

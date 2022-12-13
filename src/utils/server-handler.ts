import { API_URL } from './constants'

type AppUser = {
  _id: string,
  email: string,
}

export function getUserId(authId: string): Promise<{_id: string}> {
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

export function getUserContacts(user: AppUser): Promise<never[]> {
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

export function queryGlobalContacts(searchTerm: string): Promise<never[]> {
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

export function addContact(_id: string, contactId: string): Promise<never[]> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      _id,
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

export function sendMessage(from: string, to: string, message: string) {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      message
    })
  };
  
  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/save-message', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then(data => {
        success ? resolve(data) : reject(data);
      });
  });
}

export function getMessagesBetweenUsers(me: string, you: string): Promise<never[]> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      me,
      you
    })
  };
  
  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/get-messages', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then(data => {
        success ? resolve(data) : reject(data);
      });
  });
}

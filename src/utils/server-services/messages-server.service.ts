import { API_URL } from "../constants";

export function sendMessage(from: string, to: string, title: string, message: string): Promise<Message> {
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      title,
      message,
      createdAt: new Date()
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

export function getMessagesBetweenUsers(me: string, you: string, index?: string): Promise<Message[]> {
  let data: any = {
    me,
    you
  };
  if (index) data.index = index;
  const config: RequestInit = {
    method: 'POST',
    body: JSON.stringify(data)
  };
  
  return new Promise((resolve, reject) => {
    let success = false;
    fetch(API_URL + '/get-messages', config)
      .then(res => {
        success = res.ok;
        return res.json();
      })
      .then(data => {
        data = success && data && data.length ? data : []; 
        success ? resolve(data) : reject(data);
      });
  });
}

export type Message = {
  _id: string,
  from: string,
  to: string,
  message: string,
  createdAt: Date,
  prettyDate?: string
}

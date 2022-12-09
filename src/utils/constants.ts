export const PROD = 'simple-chat-production.up.railway.app';
export const IS_LOCAL = window.location.host.indexOf("localhost") > -1 || window.location.host.indexOf("127.0.0.1") > -1;
export const SERVER = IS_LOCAL ? 'localhost:8080' : PROD;
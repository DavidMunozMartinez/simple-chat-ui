export const PROD = 'simple-chat-production.up.railway.app';
export const IS_LOCAL = window.location.host.indexOf("localhost") > -1 || window.location.host.indexOf("127.0.0.1") > -1;
export const SERVER = IS_LOCAL ? 'localhost:8080' : PROD;
export const API_URL = (IS_LOCAL ? 'http://' : 'https://') + SERVER; 
export const SUPABASE_URL = 'https://skowrcnckfqojielfwyv.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrb3dyY25ja2Zxb2ppZWxmd3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA1NTk0MDcsImV4cCI6MTk4NjEzNTQwN30.11E4Hozu1BXOqwUFfyMwajuiGFCx2C1-RK88PUanPic'
export const WEB_PUSH_KEY = 'BDzk6EymE1fkAQvlTJiNaPBU8gw3xROH9roKRFoJuBVLM6LZhj09tIKNl6Dg-3iTHyx7JmDwT-DrdzC55g5aTkE'
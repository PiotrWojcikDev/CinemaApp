import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtDecodeService {

  currentTime = 0;

  constructor() {
    this.currentTime = new Date().getTime() / 1000;  
  }
  
  decodeToken(token: string | null): any {
    if (token) {
      try {
        token = token.split(' ')[1];
        const decodedToken: any = jwt_decode(token);
        if (decodedToken.exp && decodedToken.exp > this.currentTime) { //ważność tokenu (czy nie wygasł)
          return decodedToken;
        }
        return null;
      } catch (error) {
        console.log('Error decoding token:', error);
      }
    }
    return null;
  }
}

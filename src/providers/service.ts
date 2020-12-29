import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
// import { Observable } from 'rxjs/observable';
import {Observable} from 'rxjs/Rx';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class DataService {
  options;
  getbtc = 'https://api.cryptonator.com/api/ticker/btc-usd';


  constructor(private http:Http) { }

  getbtcrt(){
    return this.http.get(this.getbtc);
  }
}

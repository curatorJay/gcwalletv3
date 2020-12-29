import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Http, Headers, RequestOptions} from '@angular/http';

// import { CookieService } from 'ngx-cookie-service';
// import { HttpClientModule } from '@angular/common/http'; 
// import { HttpModule } from '@angular/http';

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map'; /** THis is backward compatibility, but not necessary for this app (angular5) */
import 'rxjs/add/operator/toPromise';
import { Logger } from '../../providers/logger/logger';
/*
  Generated class for the Login provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {
  private locurl: string;
  private locurlForBrowser: string;
  private apiurl;
  public results: Object[];
  public newResults: any;
  public options;
  public transactionsurl;
  public cookie;
  public cookieval;


  constructor(
    public http: HttpClient,
    private htttp: Http,
    private platform: Platform,
    public logger: Logger
  ) {
    console.log('this is the login service');
    this.apiurl =  'https://api.customer-portal.dev.getcns.tech';
    this.transactionsurl = 'https://api.customer-portal.dev.getcns.tech/transactions';
    this.locurl = 'assets/identloc.json';
    this.locurlForBrowser = '../../../../assets/identloc.json';
  }

  createHeaders2(username,password){
    this.options = new RequestOptions({ 
      headers: new Headers({
        "Authorization": "Basic " + btoa(username + ':' + password),
        "Content-Type": "application/x-www-form-urlencoded"
      })
    })
  }

  createHeaders(){
    this.options = new RequestOptions({ 
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    })
  }

  getlocationslocal() {
    if (this.platform.is('cordova')) {
      // make your native API calls
      return this.http.get(this.locurl);
    } else {
      return this.http.get(this.locurlForBrowser);
    }
  }

  register(data){
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    return this.http.post(this.apiurl + '/register', data, {headers: headers, observe: "response", withCredentials: true, responseType: "json"}); 
  } 

  check(data){
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    return this.http.get(this.apiurl + '/check?phone='+ data, {headers: headers, observe: "response", withCredentials: true, responseType: "json"}); 
  } 

  reset(data){
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    return this.http.post(this.apiurl + '/reset-password', data, {headers: headers, observe: "response", withCredentials: true, responseType: "json"}); 
  } 

  getLocation(){
    return this.http.get('https://getcoins.com/hub/locations.json'); 
  } 


  getTransactions(token, cookie, data){
    const headers = new HttpHeaders({
      'X-App-Token':  token,
      'Authorization' : cookie
    })
    console.log(token);
    return this.http.get(this.apiurl + '/transaction?phone_number=' + data, {headers: headers, observe: "response", withCredentials: true, responseType: "json"}); 
  } 

  updateUser(data){
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    return this.http.post(this.apiurl + '/confirm', data, {headers: headers, observe: "response", withCredentials: true, responseType: "json"}); 
  }

  login(uname, pword, url){
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        "Authorization": "Basic " + btoa(uname + ':' + pword)
      })
      this.cookie = headers;
      return this.http.get(this.apiurl + url, {headers: headers, observe: "response", withCredentials: true, responseType: "json"});
  }

  loginUser(uname, pword) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/json',
        'Content-Type':  'application/x-www-form-urlencoded',
        "Authorization": "Basic " + btoa(uname + ':' + pword)
        // "Access-Control-Allow-Origin": "*"
      }),
      withCredentials: true
    };
    return new Promise((resolve, reject) => {
      this.http.get(this.apiurl + '/auth', httpOptions)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
   }
}

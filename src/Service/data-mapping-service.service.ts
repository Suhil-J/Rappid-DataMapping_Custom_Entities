import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataMappingServiceService {

  constructor(private http: HttpClient) { }
  LoadGraphItems() {
    return this.http.get("../assets/DataMapping.json");
  }
}

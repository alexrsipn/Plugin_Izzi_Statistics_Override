import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Activity,
  EnumerationItem,
  GetActivitiesReqQueryParams,
  GetActivitiesResponse,
  GetPropertyEnumerationListResponse,
  GetResourcesReqQueryParams,
  GetResourcesResponse,
  Resource,
} from '../types/ofs-rest-api';
import {
  EMPTY,
  Observable,
  concatMap,
  expand,
  forkJoin,
  toArray,
  map,
  mergeMap,
  of,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfsRestApiService {
  credentials: { user: string; pass: string } = {
    user: '',
    pass: '',
  };
  baseUrl = '';

  constructor(private readonly http: HttpClient) {}

  setUrl(string: string) {
    this.baseUrl = string;
    return this;
  }

  setCredentials(credentials: { user: string; pass: string }) {
    this.credentials = credentials;
    return this;
  }

  getAllDescendants(
    resourceId: string,
    queryParams: GetResourcesReqQueryParams
  ) {
    const limit = 100; // MAX ALLOWED BY THE API

    return this.getDescendants(resourceId, {
      ...queryParams,
      limit,
      offset: 0,
    }).pipe(
      mergeMap((response) => {
        const calls: Observable<GetResourcesResponse>[] = [];
        for (
          let offset = response.offset + limit;
          offset < response.totalResults;
          offset += limit
        ) {
          calls.push(
            this.getDescendants(resourceId, { ...queryParams, offset, limit })
          );
        }
        return forkJoin([of(response), ...calls]);
      }),
      map((responses) =>
        responses.reduce<Resource[]>((acc, elem) => [...acc, ...elem.items], [])
      )
    );
  }

  getDescendants(resourceId: string, queryParams: GetResourcesReqQueryParams) {
    const endpoint = `${this.baseUrl}/rest/ofscCore/v1/resources/${resourceId}/descendants`;
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(
        this.credentials.user + ':' + this.credentials.pass
      )}`,
    });
    const params = new HttpParams({
      fromObject: {
        ...queryParams,
        ...(!!queryParams.fields && { fields: queryParams.fields.toString() }),
      },
    });
    return this.http.get<GetResourcesResponse>(endpoint, { headers, params });
  }

  getAllActivities(
    queryParams: Exclude<GetActivitiesReqQueryParams, 'limit' | 'offset'>
  ): Observable<Activity[]> {
    let offset = 0;

    return this.getActivities({ ...queryParams, offset }).pipe(
      expand((response) => {
        if (response.hasMore) {
          // If there are more items, make another request with updated offset
          offset += response.items.length;
          return this.getActivities({ ...queryParams, offset });
        } else {
          // If no more items, complete the recursion
          return EMPTY;
        }
      }),
      concatMap((response) => response.items),
      toArray()
    );
  }

  getActivities(queryParams: GetActivitiesReqQueryParams) {
    const endpoint = `${this.baseUrl}/rest/ofscCore/v1/activities`;
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(
        this.credentials.user + ':' + this.credentials.pass
      )}`,
    });
    const params = new HttpParams({
      fromObject: {
        ...queryParams,
        resources: queryParams.resources.toString(),
        ...(!!queryParams.fields && { fields: queryParams.fields.toString() }),
      },
    });

    return this.http.get<GetActivitiesResponse>(endpoint, { headers, params });
  }

  getPropertyEnumerationList(
    propetyLabel: string
  ): Observable<EnumerationItem[]> {
    const endpoint = `${this.baseUrl}/rest/ofscMetadata/v1/properties/${propetyLabel}/enumerationList`;
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(
        this.credentials.user + ':' + this.credentials.pass
      )}`,
    });
    const params = new HttpParams().set('language', 'es-ES');

    return this.http
      .get<GetPropertyEnumerationListResponse>(endpoint, { headers, params })
      .pipe(map((response) => response.items));
  }

  getChildResources(resourceId: string, fields: string[]) {
    const endpoint = `${this.baseUrl}/rest/ofscCore/v1/resources/${resourceId}/children`;
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(
        this.credentials.user + ':' + this.credentials.pass
      )}`,
    });
    const params = new HttpParams().set('fields', fields.toString());

    return this.http
      .get<GetResourcesResponse>(endpoint, { headers, params })
      .pipe(map((res) => res.items));
  }

  getResource(resourceId: string, fields: string[]) {
    const endpoint = `${this.baseUrl}/rest/ofscCore/v1/resources/${resourceId}`;
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(
        this.credentials.user + ':' + this.credentials.pass
      )}`,
    });
    const params = new HttpParams().set('fields', fields.toString());

    return this.http.get<Resource>(endpoint, { headers, params });
  }
}

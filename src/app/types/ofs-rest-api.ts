export interface GetResourcesResponse {
  totalResults: number;
  limit: number;
  offset: number;
  items: Resource[];
}

export interface GetActivitiesResponse {
  expression: string;
  hasMore?: boolean;
  items: Activity[];
  limit?: number;
  offset?: number;
}

export interface GetActivitiesReqQueryParams {
  resources: string[];
  dateFrom?: string;
  dateTo?: string;
  fields?: string[];
  includeChildren?: 'none' | 'immediate' | 'all';
  includeNonScheduled?: 'true' | 'false';
  limit?: number;
  offset?: number;
  q?: string;
}

export interface GetResourcesReqQueryParams {
  fields?: string[];
  limit?: number;
  offset?: number;
}

export interface Resource {
  resourceId: string;
  resourceInternalId: number;
  name: string;
  parentResourceInternalId?: number;
  parentResourceId?: string;
}

export interface Activity {
  resourceId: string;
  organization: string;
  resourceInternalId: number;
  status: string;
  resourceType: string;
  name: string;
  language: string;
  languageISO: string;
  timeZoneDiff: number;
  timeZone: string;
  timeZoneIANA: string;
  dateFormat: string;
  timeFormat: string;
  durationStatisticsInitialRatio?: number;
  email?: string;
  phone?: string;
  parentResourceInternalId?: number;
  parentResourceId?: string;
  XR_PartnerID?: string;
  XR_MasterID?: string;
  XR_RPID?: string;
  XR_ActivadoraRep?: string;
  email_disp?: string;
  email_supervisor?: string;
  durationStatisticsInitialPeriod?: number;
  XR_TipoTecnico?: string;
  A_MotivoPrecodigoSuspension?: string;
}

export interface GetPropertyEnumerationListResponse {
  hasMore: boolean;
  totalResults: number;
  limit: number;
  offset: number;
  items: EnumerationItem[];
}

export interface EnumerationItem {
  label: string;
  active: boolean;
  name: string;
}

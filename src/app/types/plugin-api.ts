export interface Message<
  Activity = any,
  Inventory = any,
  Resource = any,
  SecuredData = any
> {
  apiVersion: number;
  method:
    | 'init'
    | 'open'
    | 'error'
    | 'wakeup'
    | 'callProcedureResult'
    | 'updateResult'
    | 'ready'
    | 'initEnd'
    | 'close'
    | 'sleep'
    | 'callProcedure'
    | 'update';
  entity: string;
  user: User;
  resource: Resource;
  team: unknown;
  queue: unknown;
  activity: Activity;
  activityList: Activity[];
  inventoryList: Inventory[];
  buttonId: string;
  securedData: SecuredData;
  openParams: unknown;
  allowedProcedures: unknown;
  errors?: Error[];
  sendInitData?: boolean;
  sendMessageAsJsObject?: boolean;
}

interface User {
  allow_desktop_notifications: number;
  allow_vibration: number;
  design_theme: number;
  format: Format;
  providers: number[];
  sound_theme: number;
  su_zid: number;
  uid: number;
  ulanguage: number;
  language: string;
  ulogin: string;
  uname: string;
  week_start: number;
}

interface Format {
  date: string;
  long_date: string;
  time: string;
  datetime: string;
}

interface Error {
  type: string;
  code: string;
  entity: string;
  entityId: string;
  propertyLabel: string;
}

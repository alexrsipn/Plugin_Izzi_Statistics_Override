import { Injectable } from '@angular/core';
import {
  ActivityDurationPatchResponseItem,
  GetActivityDurationItem,
  GetActivityDurationResponse,
  GetEnumerationValuesOfAPropertyItem,
  GetResourcesResponse,
  GetResourcesResponseItem,
  Resource,
  UpdateActivityDurationStatisticsItem,
} from './types/ofs-rest-api';
import { ComponentStore } from '@ngrx/component-store';
import { OfsApiPluginService } from './services/ofs-api-plugin.service';
import { OfsRestApiService } from './services/ofs-rest-api.service';
import { Message } from './types/plugin-api';
import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  finalize,
  forkJoin,
  switchMap,
  tap,
} from 'rxjs';
import { ControlDesk } from './types/plugin';
import { DialogService } from './services/dialog.service';
import { SheetComponent } from './components/sheet/sheet.component';
import { ExportService } from './services/export.service';

interface State {
  isLoading: boolean;
  // resources: Resource[];
  resourceFields: string[];
  controlDesks: ControlDesk[];
  layoutDataJSON: UpdateActivityDurationStatisticsItem[];
  layoutLength: number;
  activityDuration: GetActivityDurationItem[];
  propertyValues: GetEnumerationValuesOfAPropertyItem[];
  resources: GetResourcesResponseItem[];
}

const initialState: State = {
  isLoading: false,
  resources: [],
  resourceFields: [
    'resourceId',
    'resourceInternalId',
    'name',
    'parentResourceInternalId',
    'parentResourceId',
  ],
  controlDesks: [],
  layoutDataJSON: [],
  layoutLength: 0,
  activityDuration: [],
  propertyValues: [],
};

@Injectable({
  providedIn: 'root',
})
export class AppStore extends ComponentStore<State> {
  constructor(
    private readonly ofsPluginApi: OfsApiPluginService,
    private readonly ofsRestApi: OfsRestApiService,
    private readonly dialog: DialogService,
    private readonly exportService: ExportService
  ) {
    super(initialState);
    this.handleOpenMessage(this.ofsPluginApi.openMessage$);
    this.ofsPluginApi.ready();
  }

  // Selectors
  private readonly isLoading$ = this.select((state) => state.isLoading);
  private readonly layoutData$ = this.select((state) => state.layoutDataJSON);
  private readonly activityDuration$ = this.select(
    (state) => state.activityDuration
  );

  //View Model
  public readonly vm$ = this.select(
    this.isLoading$,
    this.layoutData$,
    this.activityDuration$,
    (isLoading, layoutDataJSON, activityDuration) => ({
      isLoading,
      layoutDataJSON,
      activityDuration,
    })
  );

  // Updaters
  readonly setSelectedDesk = this.updater<ControlDesk | null>(
    (state, selectedDesk) => ({
      ...state,
      selectedDesk,
    })
  );
  readonly setControlDesks = this.updater<ControlDesk[]>(
    (state, controlDesks) => ({ ...state, controlDesks })
  );
  readonly setLayoutData = this.updater<UpdateActivityDurationStatisticsItem[]>(
    (state, layoutDataJSON) => ({ ...state, layoutDataJSON })
  );
  readonly setLayoutLength = this.updater<number>((state, layoutLength) => ({
    ...state,
    layoutLength,
  }));
  readonly setActivityDuration = this.updater<GetActivityDurationItem[]>(
    (state, activityDuration) => ({ ...state, activityDuration })
  );
  readonly setPropertyValues = this.updater<
    GetEnumerationValuesOfAPropertyItem[]
  >((state, propertyValues) => ({ ...state, propertyValues }));
  readonly setResources = this.updater<GetResourcesResponseItem[]>(
    (state, resources) => ({ ...state, resources })
  );
  // readonly addResources = this.updater<Resource[]>((state, resources) => ({
  //   ...state,
  //   resources: [...state.resources, ...resources],
  // }));
  readonly setIsLoading = this.updater<boolean>((state, isLoading) => ({
    ...state,
    isLoading,
  }));

  readonly cleanLayoutData = this.updater((state) => ({
    ...state,
    layoutDataJSON: [],
  }));

  // Effects
  private readonly handleOpenMessage = this.effect<Message>(($) =>
    $.pipe(
      tap(() => this.setIsLoading(true)),
      tap(({ securedData }) => {
        const { url, user, instance, pass } = securedData;
        if (!url || !user || !instance || !pass)
          throw new Error(
            'Los campos url, user y pass son requeridos para el correcto funcionamiento del plugin'
          );
        this.ofsRestApi
          .setUrl(url)
          .setCredentials({ user: user, pass: pass, instance: instance });
      }),
      tap(() => this.setIsLoading(false))
    )
  );

  readonly GetPropertiesValues = this.effect(($) =>
    $.pipe(
      tap(() => this.setIsLoading(true)),
      concatMap(() => this.getEnumerationPropertyValues()),
      tap((res) => this.handlePropertyValuesInformation(res)),
      tap(() =>
        this.exportService.exportAsExcelFile(
          this.get().propertyValues!,
          'Propiedades'
        )
      ),
      tap(() => this.setIsLoading(false))
    )
  );

  readonly GetResources = this.effect(($) =>
    $.pipe(
      tap(() => this.setIsLoading(true)),
      concatMap(() => this.getResources()),
      tap((res) => this.setResources(res)),
      tap(() => this.handleResourcesData()),
      tap(() =>
        this.exportService.exportAsExcelFile(this.get().resources, 'Recursos')
      ),
      tap(() => this.setIsLoading(false))
    )
  );

  readonly UpdateActivityDurationStatistics = this.effect(($) =>
    $.pipe(
      tap(() => this.setIsLoading(true)),
      concatMap(() => this.updateActivityDurationStatisticsOverride()),
      concatMap(({ updatedRecords }) =>
        this.dialog.success(
          'Registros actualizados con éxito: ' +
            updatedRecords +
            ' de ' +
            this.get().layoutLength
        )
      ),
      tap(() => this.setIsLoading(false))
    )
  );

  readonly GetActivityDurationStatistics = this.effect(($) =>
    $.pipe(
      tap(() => this.setIsLoading(true)),
      concatMap(() => this.getActivityDuration()),
      tap(({ items }) => this.setActivityDuration(items)),
      // concatMap(() =>
      //   this.dialog.success(
      //     'Duraciones de actividad obtenidas de forma exitosa'
      //   )
      // ),
      tap(() => this.setIsLoading(false))
    )
  );

  public sendCloseMessage = this.effect<Partial<Message>>((data$) =>
    data$.pipe(tap(() => this.ofsPluginApi.close()))
  );

  private getEnumerationPropertyValues(): Observable<
    GetEnumerationValuesOfAPropertyItem[]
  > {
    const property = 'XA_JOBTYPE';
    return this.ofsRestApi
      .getAllEnumerationValuesOfAProperty(property)
      .pipe(catchError((e) => this.handleError(e)));
  }

  private getResources(): Observable<GetResourcesResponseItem[]> {
    return this.ofsRestApi
      .getResources()
      .pipe(catchError((e) => this.handleError(e)));
  }

  private getActivityDuration(): Observable<GetActivityDurationResponse> {
    return this.ofsRestApi
      .getActivityDurationStatistics()
      .pipe(catchError((e) => this.handleError(e)));
  }

  private updateActivityDurationStatisticsOverride(): Observable<ActivityDurationPatchResponseItem> {
    const { layoutDataJSON } = this.get();
    const body = {
      items: layoutDataJSON,
    };
    return this.ofsRestApi
      .patchUpdateActivityDuration(body)
      .pipe(catchError((e) => this.handleError(e)));
  }

  private handlePropertyValuesInformation(
    EnumerationPropertyValues: GetEnumerationValuesOfAPropertyItem[]
  ) {
    const validPropertyValues = EnumerationPropertyValues.filter(
      ({ active }) => active
    );
    this.setPropertyValues(validPropertyValues);
  }

  private handleResourcesData() {
    const { resources } = this.get();
    resources.forEach((item) => {
      delete item.inventories;
      delete item.users;
      delete item.workZones;
      delete item.workSkills;
      delete item.workSchedules;
      delete item.links;
      delete item.avatar;
    });
    this.setResources(resources);
  }

  private handleError(err: Error) {
    this.dialog.error(err);
    return EMPTY;
  }
}

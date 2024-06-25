import { Injectable } from '@angular/core';
import { Resource } from './types/ofs-rest-api';
import { ComponentStore } from '@ngrx/component-store';
import { OfsApiPluginService } from './services/ofs-api-plugin.service';
import { OfsRestApiService } from './services/ofs-rest-api.service';
import { Message } from './types/plugin-api';
import {
  EMPTY,
  catchError,
  delay,
  finalize,
  forkJoin,
  switchMap,
  tap,
} from 'rxjs';
import { ControlDesk } from './types/plugin';

interface State {
  isLoading: boolean;
  resources: Resource[];
  resourceFields: string[];
  controlDesks: ControlDesk[];
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
};

@Injectable({
  providedIn: 'root',
})
export class AppStore extends ComponentStore<State> {
  constructor(
    private readonly ofsPluginApi: OfsApiPluginService,
    private readonly ofsRestApi: OfsRestApiService
  ) {
    super(initialState);
    this.handleOpenMessage(this.ofsPluginApi.openMessage$);
    this.ofsPluginApi.ready();
  }

  // Selectors
  private readonly controlDesk$ = this.select((state) => state.controlDesks);
  private readonly isLoading$ = this.select((state) => state.isLoading);

  //View Model
  public readonly vm$ = this.select(
    this.controlDesk$,
    this.isLoading$,
    (controlDesk, isLoading) => ({
      controlDesk,
      isLoading,
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
  readonly addResources = this.updater<Resource[]>((state, resources) => ({
    ...state,
    resources: [...state.resources, ...resources],
  }));
  readonly setIsLoading = this.updater<boolean>((state, isLoading) => ({
    ...state,
    isLoading,
  }));

  private readonly handleOpenMessage = this.effect<Message>(($) =>
    $.pipe(
      tap(() => this.setIsLoading(true)),
      switchMap(({ securedData }) => {
        const { url, user, pass } = securedData;
        if (!url || !user || !pass) {
          throw new Error(
            'Los campos url, user y pass son requeridos para el correcto funcionamiento del plugin'
          );
        }
        this.ofsRestApi.setUrl(url).setCredentials({ user: user, pass: pass });
        return forkJoin([
          this.ofsRestApi.getResource(
            'GERENCIA_SKY',
            this.get().resourceFields
          ),
          this.ofsRestApi.getChildResources(
            'GERENCIA_SKY',
            this.get().resourceFields
          ),
        ]).pipe(
          tap(([sky, controlDesks]) => {
            this.setControlDesks(
              controlDesks.map((d) => ({ name: d.name, code: d.resourceId }))
            );
            this.addResources([sky, ...controlDesks]);
          }),
          catchError((err) => this.handleError(err)),
          finalize(() => this.setIsLoading(false))
        );
      })
    )
  );

  public sendCloseMessage = this.effect<Partial<Message>>((data$) =>
    data$.pipe(tap((data) => this.ofsPluginApi.close(data)))
  );

  private handleError(err: Error) {
    console.log('Error', err);
    alert('Hubo un error\n' + err.message || 'Error desconocido');
    return EMPTY;
  }
}

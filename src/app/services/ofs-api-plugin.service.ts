import { Injectable } from '@angular/core';
import { fromEvent, share, filter, map, tap } from 'rxjs';
import { Message } from '../types/plugin-api';

/**
 * For information on OFS Plugin API refer to https://docs.oracle.com/en/cloud/saas/field-service/fapcf/index.html
 */
@Injectable({
  providedIn: 'root',
})
export class OfsApiPluginService {
  private static API_VERSION = 1;

  // INPUT MESSAGES

  private message$ = fromEvent(window, 'message').pipe(
    tap((e) => this.logEvent(e as MessageEvent)),
    filter((e) => (e as MessageEvent).data),
    map((e) => (e as MessageEvent<Message>).data),
    share()
  );
  readonly initMessage$ = this.message$.pipe(
    filter((m) => m.method === 'init')
  );
  readonly openMessage$ = this.message$.pipe(
    filter((m) => m.method === 'open')
  );
  readonly wakeupMessage$ = this.message$.pipe(
    filter((m) => m.method === 'wakeup')
  );
  readonly updateResultMessage$ = this.message$.pipe(
    filter((m) => m.method === 'updateResult')
  );
  readonly errorMessage$ = this.message$.pipe(
    filter((m) => m.method === 'error')
  );

  // OUTPUT MESSAGES

  ready(sendInitData: boolean = false): void {
    const message: Partial<Message> = {
      apiVersion: OfsApiPluginService.API_VERSION,
      method: 'ready',
      sendMessageAsJsObject: true,
      sendInitData,
    };

    this.sendPostMessageData(message);
  }

  initEnd(additionalData: Partial<Message> = {}): void {
    const message: Partial<Message> = {
      ...additionalData,
      apiVersion: OfsApiPluginService.API_VERSION,
      method: 'initEnd',
    };

    this.sendPostMessageData(message);
  }

  close(additionalData: Partial<Message> = {}): void {
    const message: Partial<Message> = {
      ...additionalData,
      apiVersion: OfsApiPluginService.API_VERSION,
      method: 'close',
    };

    this.sendPostMessageData(message);
  }

  update(additionalData: Partial<Message> = {}): void {
    const message: Partial<Message> = {
      ...additionalData,
      apiVersion: OfsApiPluginService.API_VERSION,
      method: 'update',
    };

    this.sendPostMessageData(message);
  }

  sleep(additionalData: Partial<Message> = {}): void {
    const message: Partial<Message> = {
      ...additionalData,
      apiVersion: OfsApiPluginService.API_VERSION,
      method: 'sleep',
    };

    this.sendPostMessageData(message);
  }

  // AUXILIAR METHODS

  private sendPostMessageData(data: any) {
    if (document.referrer !== '') {
      this.log(
        window.location.host +
          ' -> ' +
          data.method +
          ' ' +
          this.getDomain(document.referrer),
        JSON.stringify(data, null, 4)
      );

      parent.postMessage(data, this.getOrigin(document.referrer));
    }
  }

  private getOrigin(url: string) {
    if (url != '') {
      if (url.indexOf('://') > -1) {
        return 'https://' + url.split('/')[2];
      } else {
        return 'https://' + url.split('/')[0];
      }
    }

    return '';
  }

  private getDomain(url: string) {
    if (url != '') {
      if (url.indexOf('://') > -1) {
        return url.split('/')[2];
      } else {
        return url.split('/')[0];
      }
    }

    return '';
  }

  private logEvent(event: MessageEvent) {
    if (typeof event.data === 'undefined') {
      this.log(
        window.location.host + ' <- NO DATA ' + this.getDomain(event.origin),
        null,
        null,
        true
      );
      return;
    }

    if (typeof event.data !== 'object') {
      this.log(
        window.location.host +
          ' <- NOT A JS OBJECT ' +
          this.getDomain(event.origin),
        null,
        null,
        true
      );
      return;
    }

    const message = event.data;

    if (!message.method) {
      this.log(
        window.location.host + ' <- NO METHOD ' + this.getDomain(event.origin),
        null,
        null,
        true
      );
      return;
    }

    this.log(
      window.location.host +
        ' <- ' +
        message.method +
        ' ' +
        this.getDomain(event.origin),
      JSON.stringify(message, null, 4)
    );
  }

  private log(
    title: string,
    data?: string | null,
    color?: string | null,
    warning?: boolean
  ) {
    if (!color) {
      color = '#0066FF';
    }
    if (data) {
      console.groupCollapsed(
        '%c[Plugin API] ' + title,
        'color: ' +
          color +
          '; ' +
          (warning ? 'font-weight: bold;' : 'font-weight: normal;')
      );
      console.log('[Plugin API] ' + data);
      console.groupEnd();
    } else {
      console.log(
        '%c[Plugin API] ' + title,
        'color: ' + color + '; ' + (warning ? 'font-weight: bold;' : '')
      );
    }
  }
}

import { Injectable } from '@angular/core';
import { Activity, EnumerationItem, Resource } from '../types/ofs-rest-api';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesToResourcesMapperService {
  map(
    resources: Resource[],
    activities: Activity[],
    suspensionCodes: EnumerationItem[],
    activityFields: string[]
  ): Array<Array<number | string | null | undefined>> {
    const resourceMap: { [key: string]: Resource } = resources.reduce(
      (acc, resource) => ({ ...acc, [resource.resourceId]: resource }),
      {}
    );
    const suspensionCodesMap: { [key: string]: string } =
      suspensionCodes.reduce(
        (acc, code) => ({ ...acc, [code.label]: code.name }),
        {}
      );
    const headers = new Set<string>(
      [
        'resourceId',
        'resourceExternalId',
        'resourceName',
        'parentResourceId',
        'parentResourceExternalId',
        'parentResourceName',
        'grandParentResourceId',
        'grandParentResourceExternalId',
        'grandParentResourceName',
      ].concat(activityFields)
    );
    const tableData: Array<Array<number | string | null | undefined>> = [
      Array.from(headers),
    ];

    activities.forEach((activity) => {
      const resource = resourceMap[activity.resourceId];
      const resourceParent =
        resource && resource.parentResourceId
          ? resourceMap[resource.parentResourceId]
          : null;
      const resourceGrandParent =
        resourceParent && resourceParent.parentResourceId
          ? resourceMap[resourceParent.parentResourceId]
          : null;
      if (activity.A_MotivoPrecodigoSuspension) {
        activity.A_MotivoPrecodigoSuspension =
          suspensionCodesMap[activity.A_MotivoPrecodigoSuspension];
      }

      const row: { [key: string]: number | string | null | undefined } = {
        ...activity,
        resourceId: resource?.resourceInternalId,
        resourceExternalId: activity.resourceId,
        resourceName: resource?.name,

        parentResourceId: resourceParent?.resourceInternalId,
        parentResourceExternalId: resourceParent?.resourceId,
        parentResourceName: resourceParent?.name,

        grandParentResourceId: resourceGrandParent?.resourceInternalId,
        grandParentResourceExternalId: resourceGrandParent?.resourceId,
        grandParentResourceName: resourceGrandParent?.name,
      };

      tableData.push(
        Array.from(headers).map((propertyName) => row[propertyName])
      );
    });
    return tableData;
  }
}

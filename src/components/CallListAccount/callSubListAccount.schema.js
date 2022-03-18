// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';
import { organisationSchema, extractOrganisation } from '../Organisation/organisation.schema';
import { extractUser, userSchema } from '../User/user.schema';
import { industrySchema } from '../Industry/industry.schema';
import { typeSchema } from '../Type/type.schema';
import {unitSchema} from "../Unit/unit.schema";

export const extractContact = createExtractor({
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  firstName: 'FirstName',
  lastName: 'LastName',
});

export const beanSchema = new schema.Entity(
  'beans',
  {
    unit: unitSchema,
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return {
        avatar: entity.avatar,
        callBackTaskId: entity.callBackTaskId,
        callBackTime: entity.callBackTime,
        callListAccountId: entity.callListAccountId,
        createdDate: entity.createdDate,
        deleted: entity.deleted,
        enterpriseId: entity.enterpriseId,
        firstLetter: entity.firstLetter,
        latestCallDate: entity.latestCallDate,
        latestDialDate: entity.latestDialDate,
        name: entity.name,
        numberAccount: entity.numberAccount || 0,
        numberCall: entity.numberCall || 0,
        numberDial: entity.numberDial || 0,
        numberMeeting: entity.numberMeeting || 0,
        numberProspect: entity.numberProspect || 0,
        organisationId: entity.organisationId || 0,
        ownerId: entity.ownerId,
        unitId: entity.unitId,
        updatedDate: entity.updatedDate,
        uuid: entity.uuid,
        version: entity.version
      };
    },
  }
);
export const callSubListAccountSchema = new schema.Entity(
  'callSubListAccount',
  {
    beans: [],
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return {
        beans: entity.beans,
        callListAccountId: entity.callListAccountId,
        count: entity.count,
        deleted: entity.deleted,
        enterpriseId: entity.enterpriseId,
        existedAccountIds: entity.existedAccountIds,
        lastSyncDate: entity.lastSyncDate,
        orderBeans: entity.orderBeans,
        pageIndex: entity.pageIndex,
        pageSize: entity.pageSize,
        showPrioritized: entity.showPrioritized,
        unitIds: entity.unitIds,
        unitIdsParsed: entity.unitIdsParsed,
        userIds: entity.userIds,
        userIdsParsed: entity.userIdsParsed,
      };
    },
  }
);

export const callSubListAccount = new schema.Object({
  beans: new schema.Array(beanSchema),
});

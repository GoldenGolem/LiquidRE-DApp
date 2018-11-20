// Definition of the comments collection

/**
 * - obj
 * - user
 *  - id
 *  - name
 *  - profileImage
 * - refID
 * - message
 * - createdAt
 */


import { Mongo } from 'meteor/mongo';

export const Comments = new Mongo.Collection('comments');

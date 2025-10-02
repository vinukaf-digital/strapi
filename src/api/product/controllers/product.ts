/**
 * product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  // Override the default findOne to support both numeric ID and documentId
  async findOne(ctx) {
    const { id } = ctx.params;
    const isNumericId = /^\d+$/.test(id);
    
    let entity;
    
    if (isNumericId) {
      entity = await strapi.db.query('api::product.product').findOne({
        where: { id: parseInt(id) },
      });
    } else {
      entity = await strapi.documents('api::product.product').findOne({
        documentId: id,
      });
    }

    if (!entity) {
      return ctx.notFound('Product not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Override update to support both numeric ID and documentId
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    const isNumericId = /^\d+$/.test(id);
    
    let entity;
    let documentIdToUpdate;
    
    if (isNumericId) {
      // Step 1: Find the entity by numeric id to get its documentId
      const foundEntity = await strapi.db.query('api::product.product').findOne({
        where: { id: parseInt(id) },
      });
      
      if (!foundEntity) {
        return ctx.notFound('Product not found');
      }
      
      documentIdToUpdate = foundEntity.documentId;
    } else {
      documentIdToUpdate = id;
    }
    
    // Step 2: Update using documentId
    entity = await strapi.documents('api::product.product').update({
      documentId: documentIdToUpdate,
      data: data,
    });

    if (!entity) {
      return ctx.notFound('Product not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Override delete to support both numeric ID and documentId
  async delete(ctx) {
    const { id } = ctx.params;
    const isNumericId = /^\d+$/.test(id);
    
    let entity;
    let documentIdToDelete;
    
    if (isNumericId) {
      // Step 1: Find the entity by numeric id to get its documentId
      const foundEntity = await strapi.db.query('api::product.product').findOne({
        where: { id: parseInt(id) },
      });
      
      if (!foundEntity) {
        return ctx.notFound('Product not found');
      }
      
      documentIdToDelete = foundEntity.documentId;
    } else {
      documentIdToDelete = id;
    }
    
    // Step 2: Delete using documentId
    entity = await strapi.documents('api::product.product').delete({
      documentId: documentIdToDelete,
    });

    if (!entity) {
      return ctx.notFound('Product not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
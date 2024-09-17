import { Role, GenderType } from '@prisma/client';
import Joi from 'joi';
import { password } from './custom.validation';

const createProductCategory = {
  body: Joi.object().keys({
    name: Joi.string().required()
  })
};

const createProduct = {
  body: Joi.object().keys({
    productId: Joi.number().required(),
    productName: Joi.string().required(),
    genderType: Joi.string().valid('male', 'female', 'kids', 'others').default('male'),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    actualPrice: Joi.number().required(),
    salePrice: Joi.number().required(),
    categoryId: Joi.number().required()
  })
};

const sellProducts = {
  body: Joi.array()
    .items(
      Joi.object().keys({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        totalPrice: Joi.number().positive().required(),
        userId: Joi.number().integer().positive().required()
      })
    )
    .min(1)
    .required()
};

const getProductCategory = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getProductById = {
  params: Joi.object().keys({
    id: Joi.number().integer()
  })
};

const getProductCategoryById = {
  params: Joi.object().keys({
    id: Joi.number().integer()
  })
};

export default {
  createProductCategory,
  createProduct,
  getProductCategory,
  getProductById,
  getProductCategoryById,
  sellProducts
};

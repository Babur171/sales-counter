import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { emailService, userService } from '../services';
import generatePassword from '../utils/helper';
import exclude from '../utils/exclude';
import productService from '../services/product.service';

const createProduct = catchAsync(async (req, res) => {
  const {
    productId,
    productName,
    categoryId,
    genderType,
    price,
    quantity,
    actualPrice,
    salePrice
  } = req.body;
  const user = await productService.createProduct(
    productId,
    productName,
    categoryId,
    genderType,
    price,
    quantity,
    actualPrice,
    salePrice
  );
  res.status(httpStatus.CREATED).send(user);
});

const createProductCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const user = await productService.createProductCategory(name);
  res.status(httpStatus.CREATED).send(user);
});

const getProductCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryGetProductCategory(filter, options);
  res.send(result);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productName', 'genderType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const user = await productService.getProducts(filter, options);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const sellProduct = catchAsync(async (req, res) => {
  const products = req.body;

  const user = await productService.sellProducts(products);
  res.status(httpStatus.CREATED).send(user);
});

// const getProductsById = catchAsync(async (req, res) => {
//   const user = await productService.getProducts(req.params.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   res.send(user);
// });

// const updateUser = catchAsync(async (req, res) => {
//   const user = await userService.updateUserById(req.params.userId, req.body);
//   res.send(user);
// });

// const deleteUser = catchAsync(async (req, res) => {
//   await userService.deleteUserById(req.params.userId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

export default {
  createProduct,
  getProducts,
  createProductCategory,
  getProductCategory,
  sellProduct
  // getUsers,
  // getUser,
  // updateUser,
  // deleteUser,
  // createEmploy
};

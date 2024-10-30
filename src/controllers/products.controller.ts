import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
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

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const user = await productService.updateProduct(Number(productId), req.body);
  res.send(user);
});

export default {
  createProduct,
  getProducts,
  createProductCategory,
  getProductCategory,
  sellProduct,
  updateProduct
};

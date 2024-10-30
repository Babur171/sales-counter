import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { productValidation } from '../../validations';
import productsController from '../../controllers/products.controller';

const router = express.Router();
router
  .route('/')
  .post(auth('user'), validate(productValidation.createProduct), productsController.createProduct)
  .get(auth('user'), productsController.getProducts);

router
  .route('/sell-products')
  .post(auth('user'), validate(productValidation.sellProducts), productsController.sellProduct);

router.route('/category').get(auth('user'), productsController.getProductCategory);
router
  .route('/category')
  .post(
    auth('user'),
    validate(productValidation.createProductCategory),
    productsController.createProductCategory
  );

router
  .route('/update/:productId')
  .patch(auth('user'), validate(productValidation.updateProduct), productsController.updateProduct);

export default router;

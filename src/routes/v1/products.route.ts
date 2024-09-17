import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { productValidation, userValidation } from '../../validations';
import { userController } from '../../controllers';
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
router.route('/category/:id').get(auth('user'), userController.getUser);

router
  .route('/employ')
  .post(auth('user'), validate(userValidation.createEmploy), userController.createEmploy);

export default router;

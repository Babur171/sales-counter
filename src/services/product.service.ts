import { User, Role, Product, ProductCategory, GenderType } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

const createProduct = async (
  productId: number,
  productName: string,
  categoryId: number,
  genderType: GenderType = GenderType.MALE,
  price: number,
  quantity: number,
  actualPrice: number,
  salePrice: number
): Promise<Product> => {
  return prisma.product.create({
    data: {
      productId,
      productName,
      categoryId,
      genderType,
      price,
      quantity,
      actualPrice,
      salePrice
    }
  });
};

const createProductCategory = async (name: string): Promise<ProductCategory> => {
  return prisma.productCategory.create({
    data: {
      name
    }
  });
};

const queryGetProductCategory = async <Key extends keyof ProductCategory>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = ['id', 'name', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<ProductCategory, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const category = await prisma.productCategory.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    // skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return category as Pick<ProductCategory, Key>[];
};

const getProducts = async <Key extends keyof Product>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'productId',
    'productName',
    'categoryId',
    'price',
    'quantity',
    'actualPrice',
    'salePrice',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Product, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const products = await prisma.product.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }),
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return products as (Pick<Product, Key> & { category: { id: number; name: string } })[];
};

// const getProductById = async <Key extends keyof Product>(
//   id: number,
//   keys: Key[] = [
//     'id',
//     'productId',
//     'productName',
//     'categoryId',
//     'price',
//     'quantity',
//     'actualPrice',
//     'salePrice',
//     'createdAt',
//     'updatedAt'
//   ] as Key[]
// ): Promise<Pick<Product, Key> | null> => {
//   return prisma.product.findUnique({
//     where: { id },
//     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
//   }) as Promise<Pick<Product, Key> | null>;
// };

// const getUserByEmail = async <Key extends keyof User>(
//   email: string,
//   keys: Key[] = [
//     'id',
//     'email',
//     'ownerName',
//     'phoneNumber',
//     'shopName',
//     'role',
//     'isEmailVerified',
//     'createdAt',
//     'updatedAt'
//   ] as Key[]
// ): Promise<Pick<User, Key> | null> => {
//   return prisma.user.findUnique({
//     where: { email },
//     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
//   }) as Promise<Pick<User, Key> | null>;
// };

// const deleteUserById = async (userId: number): Promise<User> => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   await prisma.user.delete({ where: { id: user.id } });
//   return user;
// };

export default {
  createProduct,
  getProducts,
  createProductCategory,
  queryGetProductCategory
  // queryUsers,
  // getUserById,
  // getUserByEmail,
  // updateUserById,
  // deleteUserById,
};

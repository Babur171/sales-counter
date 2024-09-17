import { User, Role, Product, ProductCategory, GenderType, SoldProduct } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

interface ProductPurchase {
  productId: number;
  quantity: number;
  totalPrice: number;
}

const createProduct = async (
  productId: number,
  productName: string,
  categoryId: number,
  genderType: GenderType,
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

const sellProducts = async (products: ProductPurchase[]): Promise<{ message: string } | Error> => {
  try {
    // Extract product IDs from the request
    const productIds = products.map((item) => item.productId);

    // Fetch all product data in one query
    const fetchedProducts = await prisma.product.findMany({
      where: { productId: { in: productIds } }
    });

    const productUpdates: any[] = [];
    const soldProductRecords: any[] = [];

    for (const item of products) {
      const product = fetchedProducts.find((p) => p.productId === item.productId);

      // Check if the product exists
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }

      // Check for sufficient quantity
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient quantity for product ${product.productId}.`);
      }

      // Prepare product update (reduce quantity)
      productUpdates.push({
        where: { productId: product.productId },
        data: { quantity: product.quantity - item.quantity }
      });

      // Prepare sold product record
      soldProductRecords.push({
        productId: product.id,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      });
    }

    // Perform batch updates for products
    for (const update of productUpdates) {
      await prisma.product.update(update);
    }

    // Create sold product records
    await prisma.soldProduct.createMany({ data: soldProductRecords });

    // Return a success message
    return { message: 'Products sold successfully!' };
  } catch (error) {
    return Promise.reject(error); // Return the error as a rejected promise
  }
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

type ProductWithSolidItem = Omit<Product, 'SoldProducts'> & {
  category: { id: number; name: string };
  solidItem: number;
};

const getProducts = async <Key extends keyof Product>(
  filter: object,
  options: {
    limit?: string;
    page?: string;
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
    'genderType',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<{
  products: ProductWithSolidItem[];
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  totalItems: number;
}> => {
  // Convert `limit` and `page` to numbers, default to sensible values if not provided
  const page = parseInt(options.page ?? '1', 10);
  const limit = parseInt(options.limit ?? '10', 10);
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  if (isNaN(page) || isNaN(limit)) {
    throw new Error('Page and limit must be valid numbers.');
  }

  // Fetch total count of products that match the filter
  const totalItems = await prisma.product.count({
    where: filter
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / limit);

  // Fetch paginated products with total sold quantities and exclude SoldProducts array
  const products = await prisma.product.findMany({
    where: filter,
    select: {
      ...keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
      category: {
        select: {
          id: true,
          name: true
        }
      },
      _count: {
        select: {
          SoldProducts: true // Count of SoldProducts
        }
      }
    },
    skip: (page - 1) * limit, // Ensure skip is calculated as an integer
    take: limit, // Ensure take is also an integer
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });

  // Map and compute the `solidItem` field, excluding `_count`
  const productsWithSolidItem: ProductWithSolidItem[] = products.map((product) => {
    const totalSoldQuantity = product._count.SoldProducts;

    const { _count, ...productWithoutCount } = product;

    return {
      ...productWithoutCount,
      solidItem: totalSoldQuantity,
      category: product.category
    } as unknown as ProductWithSolidItem;
  });

  // Determine next page
  const nextPage = page < totalPages ? page + 1 : null;

  // Return the paginated products, total pages, current page, next page, and total items
  return {
    products: productsWithSolidItem,
    totalPages,
    currentPage: page,
    nextPage, // Next page if available, otherwise null
    totalItems
  };
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
  queryGetProductCategory,
  sellProducts
  // queryUsers,
  // getUserById,
  // getUserByEmail,
  // updateUserById,
  // deleteUserById,
};

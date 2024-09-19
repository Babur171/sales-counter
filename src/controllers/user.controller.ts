import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { emailService, userService } from '../services';
import generatePassword from '../utils/helper';
import exclude from '../utils/exclude';

const createUser = catchAsync(async (req, res) => {
  const { email, password, role, ownerName, phoneNumber, shopName } = req.body;
  const user = await userService.createUser(
    email,
    password,
    role,
    ownerName,
    phoneNumber,
    shopName
  );
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const createEmploy = catchAsync(async (req, res) => {
  const { email, ownerId, shopName, phoneNumber, ownerName, address } = req.body;

  const password = generatePassword();
  const newUser = await userService.createUser(
    email,
    password,
    ownerName,
    shopName,
    phoneNumber,
    address
  );
  let userId = newUser.id;
  const employ = await userService.createEmployee(userId, ownerId);

  await emailService?.sendNewPasswordEmail(email, password);
  // const userWithoutPassword = exclude(employ, ['password', 'createdAt', 'updatedAt']);
  res.status(httpStatus.CREATED).send({ user: employ });
});

const expense = catchAsync(async (req, res) => {
  const { title, purpose, price } = req.body;
  const expense = await userService.createUserExpense(title, purpose, price);
  res.status(httpStatus.CREATED).send({ expense: expense });
});

const getUserExpense = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsersExpense(filter, options);
  res.send(result);
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createEmploy,
  expense,
  getUserExpense
};

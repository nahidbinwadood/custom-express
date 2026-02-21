import { IncomingMessage, ServerResponse } from 'http';
import { sendResponse } from './helpers/sendResponse';
import { getUsers, writeUsers } from './helpers/db';
import { jsonParser } from './middlewares/jsonParser';
import { IUser } from './types';
import { generateNewId } from './utils/generateNewId';
import express from './express';

const app = express();

app.use(jsonParser());

app.get('/users', async (req: IncomingMessage, res: ServerResponse) => {
  const users = await getUsers();
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Users data fetched successfully',
    data: users,
  });
});

app.post('/users', async (req: IncomingMessage, res: ServerResponse) => {
  const payload = (req as any).body as Partial<IUser>;

  const { name, email } = payload;

  if (!name || !email) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid payload',
    });
  }

  try {
    const users: IUser[] = await getUsers();
    const isExist = users?.find((item) => item?.email === payload.email);

    if (isExist) {
      return sendResponse(res, {
        success: false,
        statusCode: 409,
        message: 'A User is already exists with this email',
      });
    }

    const id = generateNewId(users);
    const updatedPayload: IUser = {
      id,
      name,
      email,
    };

    users.push(updatedPayload);

    await writeUsers(users);
    return sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'User created successfully',
      data: users,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Failed to create user',
    });
  }
});

app.delete('/users', async (req: IncomingMessage, res: ServerResponse) => {
  const { id } = (req as any).query;

  if (!id) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Id is missing',
    });
  }
  if (Number.isNaN(Number(id))) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid Id is provided',
    });
  }

  const users: IUser[] = await getUsers();
  const userIndex = users.findIndex((item) => item?.id === Number(id));

  console.log({ userIndex });

  if (userIndex === -1) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'User not found',
    });
  }

  users.splice(userIndex, 1);

  await writeUsers(users);

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User Deleted Successfully',
    data: users,
  });
});

app.patch('/users', async (req: IncomingMessage, res: ServerResponse) => {
  const { id } = (req as any).query;
  const payload = (req as any).body;

  if (!id) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'User id is required',
    });
  }

  if (Number.isNaN(Number(id))) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Invalid user id provided',
    });
  }

  const users: IUser[] = await getUsers();
  const userIndex = users?.findIndex((item) => item?.id === Number(id));

  if (userIndex === -1) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'User Not found',
    });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...payload,
  };

  await writeUsers(users);
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User updated successfully',
    data: users,
  });
});

export default app;

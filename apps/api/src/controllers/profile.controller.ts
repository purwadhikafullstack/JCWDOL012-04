import { NextFunction, Request, Response } from 'express';
import { PrismaClient, Users } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  resInternalServerError,
  resSuccess,
  resUnprocessable,
} from '@/services/responses';
import { generateJWT } from '@/services/auth/auth';
import { sendChangeEmailInstructions } from '@/services/email/templates';

const prisma = new PrismaClient();

export async function changeName(req: Request, res: Response) {
  if (!req.body.password) resUnprocessable(res, 'Password is required', null);

  const { firstName, lastName, password } = req.body;
  const user = req.user as Users;
  const passwordMatch = await bcrypt.compare(
    password,
    user.password ? user.password : '',
  );
  if (!passwordMatch) resUnprocessable(res, 'Password is incorrect', null);

  if (passwordMatch) {
    try {
      const updatedUser = await prisma.users.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
        },
      });
      resSuccess(res, 'Name updated successfully', updatedUser, 1);
    } catch (error) {
      console.error('Error', error);
      resInternalServerError(res, 'Error updating name', null);
    }
  }
}

export async function validatePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { currentPassword, newPassword } = req.body;
  const user = req.user as Users & { info?: string };
  let passwordMatch: boolean;

  if (!user.password)
    return resUnprocessable(
      res,
      "You haven't set up a password because you initially created this account with a Google Login Service. Please register an account with the same email as your Google Account first.",
      null,
      -1,
    );

  if (currentPassword && newPassword) {
    //Change password request
    passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password ? user.password : '',
    );
  } else {
    //Change email or profile picture request
    passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password ? user.password : '',
    );
  }

  if (!passwordMatch)
    return resUnprocessable(res, 'Current password is incorrect', null);
  if (passwordMatch && newPassword) req.body.password = newPassword;

  next();
}

export async function sendChangeEmail(req: Request, res: Response, next: NextFunction) {
  const token = generateJWT(req.user as Users, { newEmail: req.body.newEmail }, "1h");
  try {
    await sendChangeEmailInstructions(req.body.newEmail, token)
    resSuccess(res, 'Change email instructions sent', null, 1)
  } catch (error) {
    console.error('Change Email Request Error', error)
    return resInternalServerError(res, 'Error changing email', null)
  }
}

export async function validateEmailChangeRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user as Users & { info: { newEmail: string } };
  const { newEmail } = user.info;

  if (newEmail === user.email)
    return resUnprocessable(res, 'Email is already updated', null);

  if (req.path.includes('/verify-token'))
    return resSuccess(res, 'Email change request verified', null, 1);
  next();
}

export async function changeEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user as Users & { info: { newEmail: string } };
  const { newEmail } = user.info;

  try {
    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        email: newEmail,
        googleId: null,
      },
    });
    resSuccess(res, 'Email updated successfully', updatedUser, 1);
  } catch (error) {
    console.error('Error', error);
    resInternalServerError(res, 'Error updating email', null);
  }
}

export async function updateProfilePicture(
  req: Request,
  res: Response,
) {
  return resInternalServerError(res, "Errorrrrr", null)
  const user = req.user as Users;
  const file = req.file;
  if (!file) return resUnprocessable(res, 'File is not acceptable', null);
  try {
    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        profilePicture: file?.filename,
      },
    });
    resSuccess(res, 'Profile picture updated successfully', updatedUser, 1);
  } catch (error) {
    console.error('Error', error);
    resInternalServerError(res, 'Error updating profile picture', null);
  }
}

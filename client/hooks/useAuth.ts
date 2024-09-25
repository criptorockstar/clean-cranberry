"use client";
import { useState } from "react";
import {
  signIn as signInService,
  signUp as signUpService,
  verifyToken as verifyTokenService,
  passwordRecovery as passwordRecoveryService,
  passwordReset as passwordResetService,
  updateUser as updateUserService,
  deleteAccount as deleteAccountService,
  getAllUsers as getAllUsersService,
} from "@/services/users";
import { useAppDispatch } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import Cookies from "js-cookie";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // AUTHENTICATE USER
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await signInService(email, password);
      const {
        accessToken,
        refreshToken,
        username,
        email: userEmail,
        role,
      } = data;

      const userState = {
        username: username,
        email: userEmail,
        role,
      };

      dispatch(setUser(userState));

      Cookies.set("accessToken", accessToken, { expires: 7 });
      Cookies.set("refreshToken", refreshToken, { expires: 30 });

      return data;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // CREATE USER
  const signUp = async (
    username: string,
    email: string,
    password: string,
    passwordConfirm: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await signUpService(
        username,
        email,
        password,
        passwordConfirm,
      );

      return data;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // VERIFY TOKEN
  const verifyToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await verifyTokenService();
      return data.authenticated;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // PASSWORD RECOVERY
  const passwordRecovery = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await passwordRecoveryService(email);
      return data;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // PASSWORD RESET
  const passwordReset = async (
    password: string,
    password_confirmation: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await passwordResetService(password, password_confirmation);
      return data;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE USER
  const updateUser = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await updateUserService(username, email, password);
      return data;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE ACCOUNT
  const deleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await deleteAccountService();
      return data;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ## ADMIN ## //
  const getAllUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllUsersService();
      return data;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    passwordRecovery,
    passwordReset,
    verifyToken,
    updateUser,
    deleteAccount,
    loading,
    error,
    // ADMIN //
    getAllUsers,
  };
};

export default useAuth;

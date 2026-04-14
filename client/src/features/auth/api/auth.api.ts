import { api } from "../../../shared/lib/axios";

export const signup = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/signup", data);

export const verifyOtp = (data: { email: string; otp: string }) =>
  api.post("/auth/verify-otp", data);

export const signin = (data: { email: string; password: string }) =>
  api.post("/auth/signin", data);

export const getMe = () => api.get("/auth/me");

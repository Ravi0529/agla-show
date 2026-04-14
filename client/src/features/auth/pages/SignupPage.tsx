import { useForm } from "react-hook-form";
import { signup } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    await signup(data);
    navigate("/verify-otp", { state: { email: data.email } });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-87.5">
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("name")} placeholder="Name" />
          <Input {...register("email")} placeholder="Email" />
          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
          />

          <Button type="submit">Create Account</Button>
        </form>
      </div>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { signin } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: any) => {
    const res = await signin(data);
    login(res.data.token);
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-87.5">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("email")} placeholder="Email" />
          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
          />

          <Button type="submit">Login</Button>
        </form>
      </div>
    </div>
  );
}

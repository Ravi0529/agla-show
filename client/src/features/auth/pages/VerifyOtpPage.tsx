import { useForm } from "react-hook-form";
import { verifyOtp } from "../api/auth.api";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

export default function VerifyOtpPage() {
  const { register, handleSubmit } = useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const onSubmit = async (data: any) => {
    await verifyOtp({ email, otp: data.otp });
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-87.5">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("otp")} placeholder="Enter OTP" />
          <Button type="submit">Verify</Button>
        </form>
      </div>
    </div>
  );
}

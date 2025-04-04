"use client";

//shadcn ui
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

//react icons
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";

// SocialButton Component
const SocialButton = ({
  icon: Icon,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
}) => (
  <Button
    disabled={disabled}
    onClick={onClick}
    variant="outline"
    size="lg"
    className="bg-slate-300 hover:bg-slate-400 hover:scale-105 transition"
  >
    <Icon className="w-5 h-5" />
  </Button>
);

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Invalid email address");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Account created successfully!");
        router.push("/sign-in");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Unable to connect. Please try again later.");
    } finally {
      setPending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProvider = async (
    event: React.MouseEvent<HTMLButtonElement>,
    provider: "github" | "google"
  ) => {
    event.preventDefault();
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="h-full flex items-center justify-center bg-black">
      <Card className="md:h-[500px] w-[80%] sm:w-[420px] p-4 sm:p-8">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <CardDescription className="text-sm text-center text-accent-foreground">
            Create an account to continue
          </CardDescription>
        </CardHeader>
        {!!error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}
        <CardContent className="px-2 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              name="name"
              disabled={pending}
              placeholder="Full Name"
              value={form.name}
              onChange={handleInputChange}
              required
            />
            <Input
              type="email"
              name="email"
              disabled={pending}
              placeholder="Email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
            <Input
              type="password"
              name="password"
              disabled={pending}
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              disabled={pending}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <Button
              className="w-full"
              size="lg"
              disabled={pending}
              type="submit"
            >
              {pending ? "Creating Account..." : "Continue"}
            </Button>
          </form>

          <Separator className="my-4"/>
            <div className="flex justify-evenly items-center">
              <SocialButton
                icon={FcGoogle}
                onClick={(e) => handleProvider(e, "google")}
                disabled={pending}
              />
              <SocialButton
                icon={FaGithub}
                onClick={(e) => handleProvider(e, "github")}
                disabled={pending}
              />
            </div>
          

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?
            <Link
              href="/sign-in"
              className="text-sky-700 ml-2 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;

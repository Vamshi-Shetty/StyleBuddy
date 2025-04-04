"use client";

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
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert, Loader2 } from "lucide-react";
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

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        toast.success("Login successful");
        router.push("/");
      } else if (res?.status === 401) {
        setError("Invalid Credentials");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("SignIn Error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setPending(false);
    }
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
      <Card className="w-[90%] max-w-md p-6 sm:p-8">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center text-sm text-accent-foreground">
            Use your email or a provider to sign in.
          </CardDescription>
        </CardHeader>

        {!!error && (
          <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-700 mb-6">
            <TriangleAlert className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              aria-label="Email"
              placeholder="Email"
              disabled={pending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              aria-label="Password"
              placeholder="Password"
              disabled={pending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button className="w-full" size="lg" disabled={pending}>
              {pending ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <Separator className="my-4" />

          <div className="flex justify-center gap-4">
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

          <p className="text-center text-sm mt-4 text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-500 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;



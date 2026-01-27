"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { signupSchema, SignupFormValues } from "../../hooks/useAuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface SignupFormProps {
  isDark: boolean;
  onSubmit: (data: SignupFormValues) => Promise<void>;
  loading: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  isDark,
  onSubmit,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isDark ? "text-gray-300" : "text-gray-700"}>
                Full Name
              </FormLabel>
              <FormControl>
                <div className="relative mt-1.5">
                  <User
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    type="text"
                    className={`pl-11 h-12 ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white focus:border-cyan-500"
                        : "bg-gray-50 border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="John Doe"
                    autoFocus
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isDark ? "text-gray-300" : "text-gray-700"}>
                Email Address
              </FormLabel>
              <FormControl>
                <div className="relative mt-1.5">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    type="email"
                    className={`pl-11 h-12 ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white focus:border-cyan-500"
                        : "bg-gray-50 border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="you@example.com"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isDark ? "text-gray-300" : "text-gray-700"}>
                Password
              </FormLabel>
              <FormControl>
                <div className="relative mt-1.5">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className={`pl-11 pr-11 h-12 ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white focus:border-cyan-500"
                        : "bg-gray-50 border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="••••••••"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDark
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className={`w-full h-12 text-base font-medium ${
            isDark
              ? "bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-[0_0_30px_rgba(34,211,238,0.3)]"
              : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          }`}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <span className="flex items-center justify-center gap-2">
              Create Account
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Lock, Envelope, Eye, EyeSlash, ArrowRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { loginSchema, LoginFormValues } from "@/lib/validation/schemas/auth";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

interface LoginFormProps {
  isDark: boolean;
  onSubmit: (data: LoginFormValues) => Promise<void>;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  isDark,
  onSubmit,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const tAuth = useTranslations("auth");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-3.5">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {tAuth("email_address")}
              </FormLabel>
              <FormControl>
                <div className="relative mt-1">
                  <Envelope
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    type="email"
                    className={`pl-9.5 sm:pl-10 h-10 sm:h-11 text-sm rounded-xl ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white focus:border-cyan-500"
                        : "bg-gray-50 border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder={tAuth("email_placeholder")}
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
              <FormLabel className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {tAuth("password")}
              </FormLabel>
              <FormControl>
                <div className="relative mt-1">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className={`pl-9.5 sm:pl-10 pr-9.5 sm:pr-10 h-10 sm:h-11 text-sm rounded-xl ${
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
                    className={`absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                      isDark
                        ? "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {showPassword ? (
                      <EyeSlash className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
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
          className={`w-full h-10 sm:h-11 text-sm font-semibold rounded-xl cursor-pointer active:scale-[0.99] transition-all duration-200 ${
            isDark
              ? "bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-[0_0_24px_rgba(34,211,238,0.25)]"
              : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
          }`}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <span className="flex items-center justify-center gap-2">
              {tAuth("sign_in")}
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

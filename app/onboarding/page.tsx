"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { generateApp } from "./actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientAuth } from "@/lib/client-auth";

export default function Onboarding() {
  const formSchema = z.object({
    adminName: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
    adminEmail: z.string().email({ message: "Invalid email address" }),
    adminPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    allowSignup: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      allowSignup: true,
    },
  });
  const router = useRouter();
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    const payload = {
      name: data.adminName,
      email: data.adminEmail,
      password: data.adminPassword,
      config: {
        allowSignup: data.allowSignup,
      },
    };

    const res = await generateApp(payload);

    if (res.status !== 200) {
      form.setError("root", {
        message: "Unable to initialize app",
      });
      setLoading(false);
      return;
    } else {
      //   await clientAuth.signIn.email({
      //     email: data.adminEmail,
      //     password: data.adminPassword,
      //     callbackURL: "/",
      //   });
      router.push("/auth");
      setLoading(false);
    }
  }
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-96">
        <CardContent>
          <CardHeader>
            <CardTitle className="text-center">
              Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
            </CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adminPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={loading} type="submit">
                  {loading && <Loader2 className="animate-spin" />}Create Admin
                  Account
                </Button>

                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Edit configuration</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4">
                        <FormField
                          control={form.control}
                          name="allowSignup"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Allow Signup</FormLabel>
                              <FormControl>
                                <div>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Allow users to sign themselves up to the
                                application.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

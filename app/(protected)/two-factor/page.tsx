"use client";

import * as z from "zod";
import qrcode from "qrcode";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { BeatLoader } from "react-spinners";
import { TwoFactorSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { firstCheckTwoFactor } from "@/actions/first-check-two-factor";
import { addTwoFactor } from "@/actions/add-two-factor";
import { toast } from "sonner";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";

const TwoFactorPage = () => {
  const user = useCurrentUser();
  const { update } = useSession();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [secret, setSecret] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!user) return;
    if (user.isTwoFactorEnabled) {
      return redirect("/settings")
    }
    addTwoFactor()
      .then((data) => {
        if (data.error) {
          toast.error("Unable to fetch 2FA secret.")
        }

        if (data.success) {
          setSecret(data.success.secret);
          qrcode.toDataURL(data.success.url, (err, qrurl) => {
            setUrl(qrurl)
          });
        }
      })
  }, [user]);

  const form = useForm<z.infer<typeof TwoFactorSchema>>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: {
      code: undefined
    }
  });

  const onSubmit = (values: z.infer<typeof TwoFactorSchema>) => {
    startTransition(() => {
      if (secret.length === 0) {
        toast.error("Did not receive 2FA secret from server yet!")
      } else {
        firstCheckTwoFactor(secret, values.code)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }

            if (data.success) {
              update();
              setSuccess(data.success)
            }
          })
          .catch(() => setError("Something went wrong"));
      }
    });
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          🔐 Two Factor Authentication
        </p>
        <p className="text-muted-foreground text-sm text-center">
          Scan the QR with your TOTP app and enter the code to verify
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="flex flex-row w-[350px] items-center justify-center rounded-lg border p-3 shadow-sm">
        {url ? (
          <Image src={url} alt="2fa-qr" width={325} height={325} />
        ): (
          <BeatLoader />
        )}
        </div>
        <Form {...form}>
          <form
            className="space-y-6 w-full mt-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full"
            >
              Enable 2FA
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

}

export default TwoFactorPage;
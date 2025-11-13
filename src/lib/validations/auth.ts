import { z } from "zod";

export const authSchema = z.object({
  email: z.email("Pastikan alamat email Anda benar (misal: nama@domain.com)"),
  password: z
    .string()
    .nonempty("Kata sandi tidak boleh kosong")
    .min(8, "Kata sandi harus memiliki 8 karakter"),
});

export type authFormValues = z.infer<typeof authSchema>;

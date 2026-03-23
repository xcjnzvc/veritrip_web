/**
 * React Hook Form + Zod 진입점.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@/lib/form";
 * import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
 * import { Input } from "@/components/ui/input";
 *
 * const schema = z.object({ name: z.string().min(1, "필수입니다") });
 * type FormValues = z.infer<typeof schema>;
 *
 * function MyForm() {
 *   const form = useForm<FormValues>({
 *     resolver: zodResolver(schema),
 *     defaultValues: { name: "" },
 *   });
 *   return (
 *     <Form {...form}>
 *       <form onSubmit={form.handleSubmit(console.log)}>
 *         <FormField
 *           control={form.control}
 *           name="name"
 *           render={({ field }) => (
 *             <FormItem>
 *               <FormLabel>이름</FormLabel>
 *               <FormControl>
 *                 <Input placeholder="이름" {...field} />
 *               </FormControl>
 *               <FormMessage />
 *             </FormItem>
 *           )}
 *         />
 *       </form>
 *     </Form>
 *   );
 * }
 * ```
 */
export { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/cliient";
import { StarPicker } from "@/components/star-picker";
import { ReviewsGetOneOutput } from "@/modules/reviews/types";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface ReviewFormProps {
  productId: string;
  initialData?: ReviewsGetOneOutput;
}
const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  rating: z.number().min(1, { message: "Rating must be at least 1" }),
});
export const ReviewForm = ({ productId, initialData }: ReviewFormProps) => {
  const [isPreview, setIsPreview] = useState(!!initialData);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({ productId })
        );
        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({ productId })
        );
        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        description: data.description,
        rating: data.rating,
      });
    } else {
      createReview.mutate({
        productId: productId,
        description: data.description,
        rating: data.rating,
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-y-4"
      >
        <p className=" font-medium">
          {isPreview ? "Your rating:" : "Liked it? Give it a rating!"}
        </p>
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write your review here..."
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button
            type="submit"
            className=" bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
            variant={"elevated"}
            disabled={createReview.isPending || updateReview.isPending}
            size={"lg"}
          >
            {initialData ? "Update Review" : "Submit Review"}
          </Button>
        )}
      </form>
      {isPreview && (
        <Button
          onClick={() => setIsPreview(false)}
          type="button"
          className=" w-fit mt-4"
          variant={"elevated"}
          disabled={false}
          size={"lg"}
        >
          Edit Review
        </Button>
      )}
    </Form>
  );
};

export const ReviewFormSkeleton = () => {
  return (
    <div className=" flex flex-col gap-y-4">
      <div className=" flex flex-col gap-y-2">
        <div className=" w-24 h-4 bg-gray-200 rounded-md animate-pulse" />
        <div className=" w-32 h-4 bg-gray-200 rounded-md animate-pulse" />
      </div>
      <div className=" flex flex-col gap-y-2">
        <div className=" w-24 h-4 bg-gray-200 rounded-md animate-pulse" />
        <div className=" w-32 h-4 bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
};
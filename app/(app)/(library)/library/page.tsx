import { DEFAULT_LIMIT } from "@/app/constants";
import { LibraryView } from "@/modules/library/ui/view/library-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
const LibraryPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.library.getLibrary.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
};

export default LibraryPage;

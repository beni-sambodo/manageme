import {
  useQuery,
  useQueryClient,
  QueryKey,
  QueryFunction,
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
  useMutation,
  QueryClient,
} from "@tanstack/react-query";

// Utility function for cache invalidation
function invalidateCacheKeys(
  queryClient: QueryClient,
  invalidateKeys: QueryKey | QueryKey[]
) {
  if (!invalidateKeys) return;

  if (Array.isArray(invalidateKeys)) {
    invalidateKeys.forEach((key) => queryClient.invalidateQueries(key));
  } else {
    queryClient.invalidateQueries({ queryKey: [invalidateKeys] });
  }
}

// Custom hook for GET requests
export function useApiGet<TData, TError = unknown>(
  key: QueryKey,
  fn: QueryFunction<TData>,
  options?: any
) {
  const token = localStorage.getItem("token");

  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: fn,
    enabled: !!token,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    ...options, // Spread additional options including onSuccess/onError
  });
}

// Generalized custom hook for mutation operations
export function useApiMutation<TData, TError, TVariables = void>(
  fn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables> & {
    success?: (data: TData) => void;
    error?: (err: TError) => void;
    invalidateKeys?: QueryKey | QueryKey[];
  }
): UseMutationResult<TData, TError, TVariables> {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn: fn,
    onSuccess: (data: TData) => {
      if (options?.invalidateKeys) {
        invalidateCacheKeys(queryClient, options.invalidateKeys);
      }
      if (options?.success) {
        options.success(data);
      }
    },
    onError: (err: TError) => {
      if (options?.error) {
        options.error(err);
      }
    },
    retry: 2,
    ...options,
  });
}

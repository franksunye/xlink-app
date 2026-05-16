/** Show skeleton only when there is no cached data yet (tab revisit stays instant). */
export function isInitialQueryLoad(isPending: boolean, data: unknown): boolean {
  return isPending && data === undefined;
}

/**
 * Work-orders list: full skeleton only before the search/tab shell has ever rendered.
 * Filter-tab queryKey changes clear list data but must not re-trigger full skeleton.
 */
export function shouldShowWorkOrdersFullSkeleton(
  shellHasMounted: boolean,
  isPending: boolean,
  data: unknown
): boolean {
  if (shellHasMounted) return false;
  return isInitialQueryLoad(isPending, data);
}

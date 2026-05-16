/** Show skeleton only when there is no cached data yet (tab revisit stays instant). */
export function isInitialQueryLoad(isPending: boolean, data: unknown): boolean {
  return isPending && data === undefined;
}

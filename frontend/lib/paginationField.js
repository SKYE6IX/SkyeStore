import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
  return {
    KeyArgs: false, // this tells apollo we confiq it manually
    read(existing = [], { args, cache }) {
      const { first, skip } = args;

      //Read the number of items on the page from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      //Check if there is existing items on cache
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if there are itmes and there aren't enough to satisfy how many items are require per-page
      //and we are on the last page just send the request
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      //Cehck if there isn't existing items and send request to network
      if (items.length !== first) {
        return false;
      }

      //Check if there are items, just return them from the cache
      if (items.length) {
        return items;
      }

      return false; // fall back to network if any of those coditon didn't meet up
    },
    merge(existing, incoming, { args }) {
      const { first, skip } = args;
      //Check if there is an existing items on the cache and make a copy of it,
      // else return an empty array which will turn out false and will need
      // to read() again
      //This run when Apollo client comes back from the network
      const merged = existing ? existing.slice(0) : [];
      //The for loop is use for incase we go directly into page 6 of 10(for example)
      // which mean pages 1 to 5 were not fecth and can causes error, so we loop
      // to fill their space with null and fecth when goes to the page;
      for (let i = skip; i < skip + incoming.length; i++) {
        merged[i] = incoming[i - skip];
      }

      return merged;
    },
  };
}

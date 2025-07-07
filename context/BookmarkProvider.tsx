import { Product } from "@/types/product";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

interface BookmarkContextType {
  bookmarks: { [productId: string]: boolean };
  bookmarkedItems: Product[];
  toggleBookmark: (product: Product) => void;
}

const BookmarkContext = createContext({} as BookmarkContextType);

export const useBookmark = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }: PropsWithChildren) => {
  const [bookmarks, setBookmarks] = useState<{ [productId: string]: Product }>(
    {}
  );

  const toggleBookmark = (product: Product) => {
    setBookmarks((prev) => {
      const newBookmarks = { ...prev };
      if (newBookmarks[product.id]) {
        delete newBookmarks[product.id];
      } else {
        newBookmarks[product.id] = product;
      }
      return newBookmarks;
    });
  };
  const bookmarkedItems = useMemo(() => Object.values(bookmarks), [bookmarks]);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks: Object.fromEntries(
          Object.entries(bookmarks).map(([id]) => [id, true])
        ),
        bookmarkedItems,
        toggleBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

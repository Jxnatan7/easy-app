import React, { useState, useCallback, useRef, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { RestyleFlashListProps } from "@/components/restyle";
import { FlashList } from "../FlashList";

export type PaginatedResult<T> = {
  items: T[];
  totalPages: number;
};

interface PaginatedFlashListProps<T> extends Omit<
  RestyleFlashListProps,
  "data" | "extraData"
> {
  fetchData: (
    page: number,
    pageSize: number
  ) => Promise<PaginatedResult<T> | undefined>;
  pageSize?: number;
  ListEmptyComponent?: React.JSX.Element;
}

export function PaginatedFlashList<T>({
  fetchData,
  pageSize = 10,
  ListEmptyComponent,
  ...props
}: PaginatedFlashListProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const isLoadingRef = useRef(false);

  const fetchDataRef = useRef(fetchData);

  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  const loadData = useCallback(
    async (pageToFetch: number, shouldRefresh = false) => {
      if (isLoadingRef.current && !shouldRefresh) return;

      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const result = await fetchDataRef.current(pageToFetch, pageSize);

        if (result && result.items) {
          if (shouldRefresh) {
            setData(result.items);
          } else {
            setData((prevData) => [...prevData, ...result.items]);
          }

          setHasMore(pageToFetch < result.totalPages);
          setPage(pageToFetch);
        }
      } catch (error) {
        console.error("Erro na lista paginada:", error);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
        setIsRefreshing(false);
        setIsFirstLoad(false);
      }
    },
    [pageSize]
  );

  useFocusEffect(
    useCallback(() => {
      loadData(1, true);
    }, [loadData])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoadingRef.current && hasMore) {
      loadData(page + 1);
    }
  };

  const renderFooter = () => {
    if (!isLoading || isRefreshing) return null;
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  };

  return (
    <FlashList
      {...props}
      data={data}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      ListEmptyComponent={
        !isLoading && !isFirstLoad && data.length === 0
          ? ListEmptyComponent
          : null
      }
    />
  );
}

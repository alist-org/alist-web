import { Button, Text } from "@hope-ui/solid";
import { Match, onCleanup, onMount, Show, Switch } from "solid-js";
import { FullLoading, Paginator } from "~/components";
import { usePath, useT } from "~/hooks";
import { getPagination, objStore, State } from "~/store";

function addOrUpdateQuery(key: string, value: any, type = "pushState") {
  let url = type === "location" ? location.href : location.hash;

  if (!url.includes("?")) {
    url = `${url}?${key}=${value}`;
  } else {
    if (!url.includes(key)) {
      url = `${url}&${key}=${value}`;
    } else {
      const re = `(\\?|&|\#)${key}([^&|^#]*)(&|$|#)`;
      url = url.replace(new RegExp(re), "$1" + key + "=" + value + "$3");
    }
  }

  if (type === "location") {
    location.href = url;
  }

  if (type === "pushState") {
    history.pushState({}, "", url);
  }
}

const Pagination = () => {
  const pagination = getPagination();
  const { pageChange, page } = usePath();
  return (
    <Paginator
      total={objStore.total}
      defaultCurrent={page}
      defaultPageSize={pagination.size}
      onChange={(page) => {
        addOrUpdateQuery("page", page);
        pageChange(page);
      }}
    />
  );
};
const LoadMore = () => {
  const { loadMore, allLoaded } = usePath();
  const t = useT();
  return (
    <Show
      when={!allLoaded()}
      fallback={<Text fontStyle="italic">{t("home.no_more")}</Text>}
    >
      <Button onClick={loadMore}>{t("home.load_more")}</Button>
    </Show>
  );
};

const AutoLoadMore = () => {
  const { loadMore, allLoaded } = usePath();
  const t = useT();
  const ob = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    },
    {
      threshold: 0.1,
    }
  );
  let el: HTMLDivElement;
  onMount(() => {
    if (!allLoaded()) {
      ob.observe(el);
    }
  });
  onCleanup(() => {
    ob.disconnect();
  });
  return (
    <Show
      when={!allLoaded()}
      fallback={<Text fontStyle="italic">{t("home.no_more")}</Text>}
    >
      <FullLoading py="$2" size="md" thickness={3} ref={el!} />
    </Show>
  );
};

export const Pager = () => {
  const pagination = getPagination();
  return (
    <Switch>
      <Match when={objStore.state === State.FetchingMore}>
        <FullLoading py="$2" size="md" thickness={3} />
      </Match>
      <Match when={pagination.type === "pagination"}>
        <Pagination />
      </Match>
      <Match when={pagination.type === "load_more"}>
        <LoadMore />
      </Match>
      <Match when={pagination.type === "auto_load_more"}>
        <AutoLoadMore />
      </Match>
    </Switch>
  );
};

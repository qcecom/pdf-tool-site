import { useEffect } from "react";
import { isBrowser } from "@/utils/env";

interface MetaOptions {
  title: string;
  description?: string;
}

export function useMeta({ title, description }: MetaOptions) {
  useEffect(() => {
    if (!isBrowser) return;
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}

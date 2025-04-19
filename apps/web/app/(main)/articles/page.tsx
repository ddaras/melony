"use client";

import {
  query,
  loader,
  table,
  text,
  image,
  vstack,
  heading,
  richText,
  chip,
  dropdown,
  icon,
} from "melony";
import { getArticlesAction } from "@/lib/actions/articles";

interface Article {
  title: string;
  main_image: string;
  content: string;
  read_time: string;
  is_active: boolean;
}

interface Row {
  original: Article;
}

interface ModalConfig {
  title: string;
  content: React.ReactNode;
}

interface ModalProps {
  data: Article;
  openModal: (config: ModalConfig) => void;
}

export default function ArticlesPage() {
  return query()
    .action(getArticlesAction)
    .render((query) => {
      if (query.isPending) {
        return loader();
      }

      if (query.isError) {
        return text().content("Error fetching articles");
      }

      return table()
        .prop("data", query.data)
        .prop("onRowClick", ({ data, openModal }: ModalProps) => {
          openModal({
            title: data.title,
            content: vstack()
              .className("py-4 px-8 gap-4")
              .children([
                heading().title(data.title),
                image().src(data.main_image).alt(data.title),
                richText().prop("content", data.content),
              ]),
          });
        })
        .prop("columns", [
          {
            header: "Image",
            accessorKey: "image",
            size: 100,
            cell: ({ row }: { row: Row }) => {
              return image()
                .src(row.original.main_image)
                .alt(row.original.title)
                .className("w-8 h-8 rounded-md object-cover");
            },
          },
          {
            header: "Title",
            accessorKey: "title",
          },
          {
            header: "Read Time",
            accessorKey: "read_time",
          },
          {
            header: "Is Active",
            accessorKey: "is_active",
            size: 100,
            cell: ({ row }: { row: Row }) => {
              return chip()
                .label(row.original.is_active ? "Yes" : "No")
                .variant(row.original.is_active ? "default" : "outline");
            },
          },
          {
            header: "",
            accessorKey: "actions",
            size: 64,
            cell: ({ row }: { row: Row }) => {
              return dropdown()
                .prop("triggerLabel", icon().prop("name", "MoreHorizontal"))
                .prop("preventDefault", true)
                .prop("align", "end")
                .prop("items", [
                  { label: "Edit", onClick: () => {} },
                  { label: "Delete", onClick: () => {} },
                ]);
            },
          },
        ]);
    });
}

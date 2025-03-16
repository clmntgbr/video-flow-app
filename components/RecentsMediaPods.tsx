"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import useMediaPodContext from "@/store/context/media-pods/hooks";
import { MediaPod } from "@/store/interface/media-pod";
import { Tag } from "@/store/interface/tag";
import { Video } from "@/store/interface/video";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

function getColorByStatus(status: string) {
  if (status.includes("VIDEO_READY")) return "bg-green-500";
  if (status.includes("_ERROR")) return "bg-red-500";
  return "bg-orange-500";
}

function getNameByStatus(status: string) {
  switch (status) {
    case "UPLOAD_COMPLETE":
      return "Upload completed";

    case "SOUND_EXTRACTOR_PENDING":
      return "Sound extraction in progress";
    case "SOUND_EXTRACTOR_COMPLETE":
      return "Sound extraction completed";
    case "SOUND_EXTRACTOR_ERROR":
      return "Sound extraction error";

    case "SUBTITLE_GENERATOR_PENDING":
      return "Subtitle generation in progress";
    case "SUBTITLE_GENERATOR_COMPLETE":
      return "Subtitle generation completed";
    case "SUBTITLE_GENERATOR_ERROR":
      return "Subtitle generation error";

    case "SUBTITLE_MERGER_PENDING":
      return "Subtitle merging in progress";
    case "SUBTITLE_MERGER_COMPLETE":
      return "Subtitle merging completed";
    case "SUBTITLE_MERGER_ERROR":
      return "Subtitle merging error";

    case "SUBTITLE_TRANSFORMER_PENDING":
      return "Subtitle transformation in progress";
    case "SUBTITLE_TRANSFORMER_COMPLETE":
      return "Subtitle transformation completed";
    case "SUBTITLE_TRANSFORMER_ERROR":
      return "Subtitle transformation error";

    case "SUBTITLE_INCRUSTATOR_PENDING":
      return "Subtitle embedding in progress";
    case "SUBTITLE_INCRUSTATOR_COMPLETE":
      return "Subtitle embedding completed";
    case "SUBTITLE_INCRUSTATOR_ERROR":
      return "Subtitle embedding error";

    case "VIDEO_FORMATTER_PENDING":
      return "Video formatting in progress";
    case "VIDEO_FORMATTER_COMPLETE":
      return "Video formatting completed";
    case "VIDEO_FORMATTER_ERROR":
      return "Video formatting error";

    case "VIDEO_SPLITTER_PENDING":
      return "Video splitting in progress";
    case "VIDEO_SPLITTER_COMPLETE":
      return "Video splitting completed";
    case "VIDEO_SPLITTER_ERROR":
      return "Video splitting error";

    case "VIDEO_INCRUSTATOR_PENDING":
      return "Video embedding in progress";
    case "VIDEO_INCRUSTATOR_COMPLETE":
      return "Video embedding completed";
    case "VIDEO_INCRUSTATOR_ERROR":
      return "Video embedding error";

    case "VIDEO_READY":
      return "Video ready";

    default:
      return "Unknown status";
  }
}

const columns: ColumnDef<MediaPod>[] = [
  {
    accessorKey: "frame",
    cell: ({ row }) => {
      const frame: string = row.getValue("frame");
      return (
        <Avatar>
          <AvatarImage src={frame ?? "https://github.com/shadcn.png"} />
        </Avatar>
      );
    },
  },
  {
    accessorKey: "originalVideo",
    cell: ({ row }) => {
      const video: Video = row.getValue("originalVideo");
      return <span>{video.originalName}</span>;
    },
  },
  {
    accessorKey: "tag",
    cell: ({ row }) => {
      const tags: Tag[] = row.getValue("tag");
      return (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.uuid} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getColorByStatus(row.getValue("status"))}`} />
        {getNameByStatus(row.getValue("status"))}
      </div>
    ),
  },
  {
    accessorKey: "percent",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-30">
        <Progress value={row.getValue("percent")} getValueLabel={row.getValue("percent")} max={100} />
        {row.getValue("percent")}%
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.uuid)}>Copy payment ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function RecentsMediaPods() {
  const { mediaPod } = useMediaPodContext();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: mediaPod.recents,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="container mx-auto mt-4">
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

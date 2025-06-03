"use client"

import PaymentConfirmationModal from "@/components/modals/payment-confirmation-modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Download, DownloadCloud, MoreHorizontal } from "lucide-react"
import Link from "next/link"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Notification = {
    id: string;
    subject: string;
    tracking: string;
    message: string;
    created_at: string;
    
}

export const columns: ColumnDef<Notification>[] = [
    {
        accessorKey: "tracking",
        header: "Order"
    },
    {
        accessorKey: "message",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Notification
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const subject = row.original.subject;
            const message = row.original.message;
            return(
                <div className="flex flex-col">
                    <h1 className="text-orange-500">{subject}</h1>
                    <p>{message}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({row}) => {
            const createdDate = new Date(row.getValue("created_at")).toLocaleDateString("en-us", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            return (
                <p>{createdDate}</p>
            );
        }
    },
    
]

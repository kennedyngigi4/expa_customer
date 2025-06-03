"use client"

import PaymentConfirmationModal from "@/components/modals/payment-confirmation-modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Download, DownloadCloud, MoreHorizontal } from "lucide-react"
import Link from "next/link"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Invoice = {
    id: string
    invoice_id: string
    status: string
    total_amount: string
    amount_paid: string
    created_at: string
}

export const columns: ColumnDef<Invoice>[] = [
    {
        accessorKey: "invoice_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Invoice ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const status = row?.original?.status;
            return (
                <div className={cn("text-sm text-green-600", status == "UNPAID" && "text-red-600")}>{status}</div>
            );
        }
    },
    {
        accessorKey: "total_amount",
        header: "Total Amount",
    },
    {
        accessorKey: "amount_paid",
        header: "Amount Paid"
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
    {
        header: "Download PDF",
        cell: ({row}) => {
            const id = row?.original?.id
            return(
                <Button variant="ghost" className="cursor-pointer" size="sm">Download PDF <Download /></Button>
            )
        }
    }
]

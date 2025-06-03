"use client"

import PaymentConfirmationModal from "@/components/modals/payment-confirmation-modal"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Order = {
    id: string
    order_id: number
    recipient_fullname: string
    pickup_location: string
}

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "order_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Order ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "recipient_fullname",
        header: "Recipient",
    },
    {
        accessorKey: "recipient_location",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Destination
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        header: "Payments",
        cell: ({row}) => {
            const transactionId = row?.original?.details?.transaction_id

            return(
                <>
                    {transactionId 
                        ? (<>{transactionId}</>) 
                        : (<><PaymentConfirmationModal orderID="" detailsID="" /></>)
                    }
                </>
            );
        }
    },
    {
        header: "Status",
        cell: ({row}) => {
            const deliveryStatus = row?.original?.details?.delivery_status;
            return(
                <>{deliveryStatus}</>
            );
        }
    },
    {
        header: "Action",
        cell: ({row}) => {
            const id = row?.original?.id
            return(
                <Link href={`/orders/${id}`}><MoreHorizontal className="w-4 h-4" /></Link>
            )
        }
    }
]

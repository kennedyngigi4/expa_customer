
export async function CreateOrder(url: string, accessToken: string,  data: any): Promise<any>{
    try{
        const order = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
            method: "POST",
            headers: {
                "Authorization": `Token ${accessToken}`,
            },
            body: data,
        }) 
        const res = await order.json()
        if(res.success){
            return { "success": true, "message": "Order created", "id": res.id }
        } else {
            return { "success": false, "message": res }
        }
    } catch(e) {
        return { "success": false, "message": "Something went wrong!"}
    }
}



export async function getAllOrders(url: string, accessToken: string): Promise<any>{
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${accessToken}`,
            }
        });
        const data = await res.json()
        return data
    } catch(e) {
        return { "success": false, "message": "Something went wrong!" }
    }
}





export const AllServices = {
    post: async function (url: string, accessToken: string, data: any): Promise<any> {
        // post function
    },

    get: async function (url: string, accessToken: string): Promise<any> {
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
                method: "GET",
                headers: {
                    "Authorization": `Token ${accessToken}`,
                },
            })
            const data = await response.json();
            return data;
        } catch(e){
            return { "success": false, "message": "Something went wrong." }
        }
    },

    patch: async function (url: string, accessToken: string, data: any): Promise<any> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Token ${accessToken}`
                },
                body: data
            });
            if(response.ok){
                return { "success": true, "message": "Update successful", }
            }
            return { "success": false, "message": "Something went wrong." }
        } catch (e) {
            return { "success": false, "message": e }
        }
    },


    put:async function(url: string, accessToken: string, data: any): Promise<any>{
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Token ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                return { "success": true, "message": "Update successful", }
            }
            return { "success": false, "message": "Something went wrong." }
        } catch(e){
            return { "success": false, "message": e }
        }
    },


    delete: async function (url: string, accessToken: string, data: any): Promise<any> {
        // delete function
    }
}



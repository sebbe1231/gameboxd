

export interface APIResponse {
    success: boolean;
    message: string | null;
    data?: any;
    status: number;
}

export const failed = (msg: string, status: number) => {
    return new Response(JSON.stringify({
        success: false,
        message: msg
    }), {
        headers: {
            "content-type": "application/json"
        }, status
    })
}

export const success = (data: any = null, msg: any = null, status: number) => {
    return new Response(JSON.stringify({
        success: true,
        message: msg,
        data
    }), {
        headers: {
            "content-type": "application/json"
        }, status
    })
}
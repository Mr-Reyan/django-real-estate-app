const BASEURL = import.meta.env.VITE_DJANGO_URL
export const saveToken = (token) => {
    localStorage.setItem("access_token", token.access)
    localStorage.setItem("refresh_token", token.refresh)
}

export const clearToken = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
}

export const getAccessToken = () => {
    return localStorage.getItem("access_token")
}

export const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh");

    const res = await fetch(`${BASEURL}/api/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh })
    });

    const data = await res.json();
    localStorage.setItem("access", data.access);
};

const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh_token")

    const res = await fetch(`${BASEURL}/api/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh })
    })

    const data = await res.json()

    localStorage.setItem("access_token", data.access)

    return data.access
}


export const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem("access_token")
    const headers = options.headers ? { ...options.headers } : {}
    if (token) headers["Authorization"] = `Bearer ${token}`
    const isFormData = options.body instanceof FormData


    if (!isFormData) {
        headers["Content-Type"] = "application/json"
    }

    let res = await fetch(url, {
        ...options,
        headers
    })

    // if token expired
    if (res.status === 401) {
        token = await refreshAccessToken()

        res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`
            }
        })
    }

    return res
}
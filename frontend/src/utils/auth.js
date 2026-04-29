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

export const authFetch = (url, options = {}) => {
    const token = getAccessToken()
    const headers = options.headers ? { ...options.headers } : {}
    if (token) headers["Authorization"] = `Bearer ${token}`
    headers["Content-Type"] = "application/json"

    return fetch(url, {
        ...options,
        headers
    })
}
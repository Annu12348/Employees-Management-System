import instance from "../utils/axios"

export const logoutApi = async () => {
    return await instance.post("/auth/logout", {}, {
        withCredentials: true
    })
}
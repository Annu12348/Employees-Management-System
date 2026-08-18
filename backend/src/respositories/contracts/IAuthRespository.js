class IAuthRespository {
    async findAuthByEmail (email) {
        throw new Error("method not implement")
    }
}

export default IAuthRespository;


type UserLog = {
    // id: number,
    userId: number,
    userGender: string,
    loginAt: number,
    logoutAt: number,
    activities: {
        getCount: number,
        postCount: number
    }
}

export default UserLog;
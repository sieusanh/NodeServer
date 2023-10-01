import RequestParams from './request-params';

interface UserLogParams extends RequestParams {
    userId: number;
    userGender: string;
    loginFrom: number;
    loginTo: number;
    getCount: number;
    postCount: number;
    limit: number
};

export default UserLogParams;
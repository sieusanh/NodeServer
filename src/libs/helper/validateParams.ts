import RequestParams from '../interfaces/request-params';

function normalizeType(src: number | string,
    dest: number | string) {
    if (typeof src == 'number') {
        return +dest;
    }
}

function validateParams(paramPattern: RequestParams,
    params: RequestParams) {

    for (const key of Object.keys(params)) {
        if (key in paramPattern) {
            params[key] = normalizeType(
                paramPattern[key], params[key]);
            if (key === 'getCount' || key === 'postCount') {
                params[`activities.${key}`] = params[key];
            }
        } else {
            return {
                params: { limit: 10 },
                errMessage: `Field not existed: ${key}`
            };
        }
    }

    return {
        params,
        errMessage: ''
    };
}

export default validateParams;
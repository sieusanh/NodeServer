const mapping = {

    // Common api
    count: 'get',
    find: 'get',
    register: 'post',
    checkRedis: 'post',

    // User api
    create: 'post',
    update: 'patch',
    commit: 'post',

    // Admin 
    delete: 'delete',
    deleteOne: 'delete'
};

export default mapping;

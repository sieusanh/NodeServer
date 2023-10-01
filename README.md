# NodeServer (Continuous updating)
 This repository focus on system performance optimization techniques: Caching, Data query tuning, Database indexing and partitioning, Handle high concurrent request number.

Physics: 4 Cores CPU, 16GB RAM

Achievements:

+ Reuseable code:
Methods in Postgres and Mongodb class can be used by different tables 
Function validateParams can be used by multiple different endpoints

+ Increasing request performance:
Test with 40k request, 10k concurrent request, autocannon

Without cluster:

18.88s, 9.92 MB read
Average 3077 Req/Sec, Average 763kB Bytes/Sec 

16.99s, 9.92 MB read
Average 3333 Req/Sec, Average 827 kB Bytes/Sec

17s, 9.92 MB read
Average 3636 Req/Sec, Average 902 kB Bytes/Sec

With cluster (70% of 8cpu = 5cpu):

15.36s, 9.93 MB read
Average 4000 Req/Sec, Average 993 kB Bytes/Sec

15.91s, 9.93 MB read
Average 3999 Req/Sec, Average 993 kB Bytes/Sec

14.36s, 9.95 MB read
Average 4444 Req/Sec, Average 1.11 MB Bytes/Sec

+ Populating 10 million documents in MongoDB within 3'
Collection userLog: 
{
    userId: number,
    userGender: string,
    loginAt: number,
    logoutAt: number,
    activities: { 
        getCount: number, 
        postCount: number 
    }
}

+ Decreasing response time from 6970ms to 57ms using Redis cache
GET http://localhost:9000/v1/api/logging/find?userId=98&limit=10000
Received 9895 documents.

+ Decreasing query execution time in MongoDB over 10 million documents from 5.7s to 6.7ms

Before indexing:
nReturned: 9895
executionTimeMillis: 5774
totalKeysExamined: 0
totalDocsExamined: 10000000

After indexing:
nReturned: 9895
executionTimeMillis: 669
totalKeysExamined: 9895
totalDocsExamined: 9895

+ Solving multiple order request at the same time when database having insufficient stock count

Request: POST http://localhost:9000/v1/api/account/checkRedis

Solution: Taking advantage of Redis single thread feature11





















autocannon -a 40 -c 20 -d 10 -m POST http://localhost:9000/v1/api/compression

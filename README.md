# NodeServer (Continuous updating)
 This repository focus on system performance optimization techniques: Caching, Data query tuning, Database indexing and partitioning, Handle high concurrent request number.


+ Solving multiple order request at the same time when database having insufficient stock count

    Request: POST http://localhost:9000/v1/api/account/checkRedis

    Solution: Taking advantage of Redis single thread


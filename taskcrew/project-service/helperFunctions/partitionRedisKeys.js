import redisClient from "../redis/redisClient.js";


const partitionRedisKeys = async(keys) => {
    const present=[];
    const missing=[];

    for(const key of keys) {

        const exists = await redisClient.exists(key);
        if (exists) {
            present.push(await redisClient.get(key));
        } else {
            missing.push(key);
        }
    }
    return { present, missing };

}

export {partitionRedisKeys};
import redisClient from "../redis/redisClient.js";


const partitionRedisKeys = async (keys) => {
    const present = {};
    const missing = [];

    if (!Array.isArray(keys) || keys.length === 0) {
        return { present, missing };
    }

     const values = await redisClient.mGet(keys);

   keys.forEach((key, idx) => {
    const val = values[idx];
    if (val !== null) {
      present[key] = val;
    } else {
      missing.push(key);
    }
  });

  return { present, missing };

}

export { partitionRedisKeys };
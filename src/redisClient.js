// Import the Redis package
const redis = require('redis');

options = {
    host: 'localhost',
    port: 6379,
    db : 0    
}
const client = redis.createClient(options);

client.on('error', (err) => {
    console.log('Redis Client Error:', err);
});

async function connectRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis!');
    } catch (err) {
        console.log('Failed to connect to Redis:', err);
    }
}

async function addRecordWithTTL(key, value, TTL) {
    try {
        await client.setEx(key, TTL, value);
        console.log(`Record added: ${key} = ${value} with TTL of ${TTL} seconds.`);
        return true
    } catch (err) {
        console.log('Error adding record with TTL:', err);
        return false
    }
}

async function getRecord(key) {
    try {
        // Retrieve the value of the key
        const value = await client.get(key);

        if (value) {
            // Get the current TTL of the key (in seconds)
            const ttl = await client.ttl(key);
            
            // If the key has a TTL, increase it by 120 seconds
            if (ttl !== -1 && ttl < 7000) {
                await client.expire(key, ttl + 120);
                console.log(`TTL of key "${key}" increased by 120 seconds.`);
            }
            
            console.log(`Record retrieved: ${key} = ${value}`);
            return value;
        } else {
            console.log(`Record not found: ${key}`);
            return null;
        }
    } catch (err) {
        console.log('Error retrieving record:', err);
        return null;
    }
}


connectRedis();

module.exports = { 
    addRecordWithTTL,
    getRecord
};
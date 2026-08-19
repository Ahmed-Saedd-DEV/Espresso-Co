local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillInterval = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])

local bucket = redis.call("HMGET", key, "tokens", "lastRefill")

local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

if tokens == nil then
    tokens = capacity
    lastRefill = now
end

local elapsed = now - lastRefill

local tokensToAdd = math.floor(
    elapsed / refillInterval
)

if tokensToAdd > 0 then
    tokens = math.min(
        capacity,
        tokens + tokensToAdd
    )

    lastRefill =
        lastRefill +
        (tokensToAdd * refillInterval)
end

if tokens <= 0 then
    redis.call("EXPIRE", key, ttl)

    return {
        0,
        tokens,
        lastRefill
    }
end

tokens = tokens - 1

redis.call(
    "HSET",
    key,
    "tokens",
    tokens,
    "lastRefill",
    lastRefill
)

redis.call("EXPIRE", key, ttl)

return {
    1,
    tokens,
    lastRefill
}
from cachetools import TTLCache

from core.config import settings

_cache: TTLCache = TTLCache(maxsize=1024, ttl=settings.cache_ttl)


def get(key: str):
    return _cache.get(key)


def set(key: str, value):
    _cache[key] = value


def clear():
    _cache.clear()

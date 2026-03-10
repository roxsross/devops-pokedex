from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    pokeapi_base_url: str = "https://pokeapi.co/api/v2"
    cache_ttl: int = 300
    workers: int = 2
    cors_origins: list[str] = ["*"]

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()

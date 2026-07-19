from functools import lru_cache
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic import AliasChoices, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = Field(default="local", validation_alias=AliasChoices("APP_ENV", "app_env"))
    demo_mode: bool = True
    demo_otp: str = "1234"
    secret_key: SecretStr = Field(default=SecretStr("change-me-in-production"), validation_alias=AliasChoices("JWT_SECRET", "SECRET_KEY", "secret_key"))
    refresh_secret_key: SecretStr = Field(default=SecretStr("change-me-refresh-in-production"), validation_alias=AliasChoices("JWT_REFRESH_SECRET", "refresh_secret_key"))
    mongodb_uri: str = Field(default="mongodb://localhost:27017", validation_alias=AliasChoices("MONGODB_URI", "MONGODB_URL", "mongodb_uri", "mongodb_url"))
    mongodb_database: str = Field(default="shubh_power_ev", validation_alias=AliasChoices("MONGODB_DATABASE", "MONGODB_DB", "mongodb_database", "mongodb_db"))
    cors_origins_raw: str = Field(default="http://localhost:8081,http://localhost:19006", validation_alias=AliasChoices("CORS_ORIGINS", "BACKEND_CORS_ORIGINS", "cors_origins_raw"))
    access_token_minutes: int = Field(default=30, validation_alias=AliasChoices("ACCESS_TOKEN_EXPIRE_MINUTES", "access_token_minutes"))
    refresh_token_days: int = Field(default=30, validation_alias=AliasChoices("REFRESH_TOKEN_EXPIRE_DAYS", "refresh_token_days"))
    require_mongodb: bool = Field(default=False, validation_alias=AliasChoices("REQUIRE_MONGODB", "require_mongodb"))
    log_level: str = "INFO"
    station_source_csv: str = Field(
        default="../station-research/google-maps-verified/ALL_STATIONS_GOOGLE_MAPS_VERIFIED.csv",
        validation_alias=AliasChoices("STATION_SOURCE_CSV", "station_source_csv"),
    )

    model_config = SettingsConfigDict(env_file=(".env", "backend/.env"), extra="ignore")

    @field_validator("mongodb_uri")
    @classmethod
    def validate_mongodb_uri(cls, value: str) -> str:
        if "<" in value or ">" in value:
            raise ValueError("MONGODB_URI still contains a placeholder. Set the real Atlas password in backend/.env.")
        return normalize_mongodb_uri(value)

    @property
    def cors_origins(self) -> list[str]:
        if self.cors_origins_raw.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]

    @property
    def masked_mongodb_uri(self) -> str:
        if "@" not in self.mongodb_uri:
            return self.mongodb_uri
        prefix, suffix = self.mongodb_uri.split("@", 1)
        user = prefix.split("//", 1)[-1].split(":", 1)[0]
        scheme = prefix.split("//", 1)[0] + "//"
        return f"{scheme}{user}:****@{suffix}"


@lru_cache
def get_settings() -> Settings:
    return Settings()


def normalize_mongodb_uri(value: str) -> str:
    if not value.startswith("mongodb+srv://"):
        return value
    parts = urlsplit(value)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query.setdefault("retryWrites", "true")
    query.setdefault("w", "majority")
    query.setdefault("tls", "true")
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))

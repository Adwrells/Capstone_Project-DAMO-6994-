"""
Healthcare Analytics Platform - JWT & password verification

There is a single seeded account (AUTH_USERNAME / AUTH_PASSWORD in settings), not a
users table — this platform has no self-registration and no per-user roles today.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

try:
    from backend.config import settings
except ImportError:
    from config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hashed once at import time so a login comparison never touches the plaintext
# AUTH_PASSWORD env var directly.
_SEEDED_PASSWORD_HASH = pwd_context.hash(settings.AUTH_PASSWORD)


def authenticate(username: str, password: str) -> bool:
    """True if username/password match the single seeded account.

    Always runs the bcrypt verify, even on a username mismatch, so a wrong
    username doesn't return measurably faster than a wrong password.
    """
    password_ok = pwd_context.verify(password, _SEEDED_PASSWORD_HASH)
    return password_ok and username == settings.AUTH_USERNAME


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": subject, "exp": expire},
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> Optional[str]:
    """Returns the subject claim, or None if the token is missing/invalid/expired."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None
    return payload.get("sub")

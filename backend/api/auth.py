"""
Healthcare Analytics Platform - API Router: Auth
"""

from typing import Dict

try:
    from fastapi import APIRouter, Depends, HTTPException, Request, status
    from fastapi.security import OAuth2PasswordRequestForm
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def post(self, *args, **kwargs): return lambda f: f
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str, headers=None):
            self.status_code = status_code
            self.detail = detail

try:
    from backend.auth.security import authenticate, create_access_token
    from backend.auth.rate_limit import limiter
except ImportError:
    from auth.security import authenticate, create_access_token
    from auth.rate_limit import limiter

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()) -> Dict[str, str]:
    """Issues a bearer token for the platform's single seeded account.

    Rate-limited to 5 attempts/minute per IP (slowapi, in-memory) — the seeded account has
    no lockout of its own, so this is what stands between a weak/default password and an
    unthrottled brute-force loop.
    """
    if not authenticate(form_data.username, form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(subject=form_data.username)
    return {"access_token": token, "token_type": "bearer"}

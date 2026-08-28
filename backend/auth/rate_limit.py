"""
Healthcare Analytics Platform - Rate limiting for auth endpoints

In-memory only (slowapi's default `limits`/`MemoryStorage` backend): the counter resets on
every restart and is not shared across processes. That is fine for this single-process
deployment, but a multi-worker/multi-instance deployment would need a shared backend
(e.g. Redis, via `Limiter(storage_uri="redis://...")`) for the limit to hold across workers.

Shared between `main.py` (registers the exception handler / middleware) and `auth.py`
(applies the `@limiter.limit(...)` decorator) so both reference the same Limiter instance.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

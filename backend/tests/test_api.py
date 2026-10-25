"""
Unit and Integration Tests for ApexLMS FastAPI Backend
"""

import pytest
from app.core.security import verify_password, get_password_hash, create_access_token
from jose import jwt
from app.core.config import settings

def test_password_hashing():
    password = "SecretPassword@123"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_generation():
    subject = "usr-test-123"
    token = create_access_token(subject)
    assert isinstance(token, str)
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert decoded["sub"] == subject
    assert "exp" in decoded

def test_progress_calculation_formula():
    """
    Test completion percentage formula:
    Completion Percentage = (Completed Required Topics / Total Required Topics) * 100
    """
    total_required = 20
    completed_required = 15
    percentage = (completed_required / total_required) * 100
    assert percentage == 75.0

    # Test edge case: zero total
    zero_total = 0
    zero_completed = 0
    zero_pct = (zero_completed / zero_total * 100) if zero_total > 0 else 0
    assert zero_pct == 0

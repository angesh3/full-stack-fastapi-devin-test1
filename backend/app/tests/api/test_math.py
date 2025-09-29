import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_divide_success():
    """✅ Division works correctly for valid inputs"""
    response = client.get("/divide?a=6&b=2")
    assert response.status_code == 200
    assert response.json() == {"result": 3.0}


def test_divide_by_zero():
    """❌ Division by zero triggers a server error (bug to fix later)"""
    response = client.get("/divide?a=1&b=0")
    # Right now this will fail with 500
    # Once fixed, we expect a 400 with JSON error
    assert response.status_code == 500


from fastapi.testclient import TestClient

from app.core.config import settings


def test_divide_success(client: TestClient) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/math/divide",
        params={"a": 10.0, "b": 2.0},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["result"] == 5.0


def test_divide_negative_numbers(client: TestClient) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/math/divide",
        params={"a": -10.0, "b": 2.0},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["result"] == -5.0


def test_divide_by_zero(client: TestClient) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/math/divide",
        params={"a": 10.0, "b": 0.0},
    )
    assert response.status_code == 500


def test_divide_decimals(client: TestClient) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/math/divide",
        params={"a": 7.5, "b": 2.5},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["result"] == 3.0


def test_divide_zero_by_number(client: TestClient) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/math/divide",
        params={"a": 0.0, "b": 5.0},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["result"] == 0.0


def test_divide_large_numbers(client: TestClient) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/math/divide",
        params={"a": 1000000.0, "b": 1000.0},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["result"] == 1000.0

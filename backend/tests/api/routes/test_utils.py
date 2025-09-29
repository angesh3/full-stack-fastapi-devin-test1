from unittest.mock import patch

from fastapi.testclient import TestClient

from app.core.config import settings


def test_health_check(client: TestClient) -> None:
    response = client.get(f"{settings.API_V1_STR}/utils/health-check/")
    assert response.status_code == 200
    assert response.json() is True


@patch("app.api.routes.utils.send_email")
@patch("app.api.routes.utils.generate_test_email")
def test_test_email_superuser(
    mock_generate_test_email,
    mock_send_email,
    client: TestClient,
    superuser_token_headers: dict[str, str],
) -> None:
    from app.utils import EmailData

    mock_generate_test_email.return_value = EmailData(
        subject="Test Subject",
        html_content="<p>Test Content</p>",
    )

    email_to = "test@example.com"
    response = client.post(
        f"{settings.API_V1_STR}/utils/test-email/",
        headers=superuser_token_headers,
        params={"email_to": email_to},
    )
    assert response.status_code == 201
    content = response.json()
    assert content["message"] == "Test email sent"
    mock_generate_test_email.assert_called_once_with(email_to=email_to)
    mock_send_email.assert_called_once()


def test_test_email_unauthorized(
    client: TestClient, normal_user_token_headers: dict[str, str]
) -> None:
    email_to = "test@example.com"
    response = client.post(
        f"{settings.API_V1_STR}/utils/test-email/",
        headers=normal_user_token_headers,
        params={"email_to": email_to},
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "The user doesn't have enough privileges"


def test_test_email_no_auth(client: TestClient) -> None:
    email_to = "test@example.com"
    response = client.post(
        f"{settings.API_V1_STR}/utils/test-email/",
        params={"email_to": email_to},
    )
    assert response.status_code == 401
    content = response.json()
    assert content["detail"] == "Not authenticated"

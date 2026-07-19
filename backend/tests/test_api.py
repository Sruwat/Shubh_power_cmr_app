from fastapi.testclient import TestClient
from uuid import uuid4

from backend.app.main import app
from backend.app.services.stations import seed_demo_station


def auth_headers(client: TestClient) -> dict[str, str]:
    client.post("/api/v1/auth/request-otp", json={"phone": "9876543210"})
    response = client.post("/api/v1/auth/verify-otp", json={"phone": "9876543210", "otp": "1234"})
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def test_otp_nearby_charging_wallet_support_flow():
    seed_demo_station()
    with TestClient(app) as client:
        headers = auth_headers(client)
        nearby = client.get("/api/v1/stations/nearby?latitude=28.5355&longitude=77.3910&radius_km=80", headers=headers)
        assert nearby.status_code == 200
        assert nearby.json()["count"] >= 1

        config = client.get("/api/v1/config/mobile").json()
        charger_id = config["demo_charger_ids"][0]
        validation = client.post("/api/v1/charging/validate", json={"charger_id": charger_id}, headers=headers)
        assert validation.json()["valid"] is True

        payment = client.post("/api/v1/payments/intents", json={"amount_inr": 200, "purpose": "charging_session"}, headers=headers).json()
        client.post("/api/v1/payments/demo-complete", json={"payment_id": payment["payment_id"], "success": True}, headers=headers)
        session = client.post(
            "/api/v1/charging/sessions",
            json={"charger_id": charger_id, "connector_id": f"{charger_id}-CCS2", "payment_id": payment["payment_id"], "idempotency_key": f"test-start-{uuid4().hex}"},
            headers=headers,
        )
        assert session.status_code == 200
        session_id = session.json()["id"]
        active = client.get("/api/v1/charging/sessions/active", headers=headers)
        assert active.json()["session"]["id"] == session_id
        stopped = client.post(f"/api/v1/charging/sessions/{session_id}/stop", headers=headers)
        assert stopped.json()["status"] == "COMPLETED"

        wallet = client.post("/api/v1/wallet/top-up", json={"amount_inr": 100}, headers=headers)
        assert wallet.json()["wallet"]["balance_inr"] >= 100

        ticket = client.post("/api/v1/support/tickets", json={"category": "charging", "message": "Demo test ticket", "session_id": session_id}, headers=headers)
        assert ticket.status_code == 200

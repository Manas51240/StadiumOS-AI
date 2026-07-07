import pytest
import datetime

# Entities
from app.features.auth.domain.entities import UserEntity
from app.features.crowd.domain.entities import CrowdAlertEntity
from app.features.navigation.domain.entities import NavigationNodeEntity
from app.features.emergency.domain.entities import IncidentEntity
from app.features.volunteer.domain.entities import VolunteerTaskEntity
from app.features.sustainability.domain.entities import SustainabilityMetricEntity
from app.features.reports.domain.entities import OperationReportEntity

# SQL Repositories
from app.features.auth.data.repository_impl import SQLAuthRepository
from app.features.crowd.data.repository_impl import SQLCrowdRepository
from app.features.navigation.data.repository_impl import SQLNavigationRepository
from app.features.emergency.data.repository_impl import SQLIncidentRepository
from app.features.volunteer.data.repository_impl import SQLVolunteerRepository
from app.features.sustainability.data.repository_impl import SQLSustainabilityRepository
from app.features.reports.data.repository_impl import SQLReportsRepository

# Services
from app.features.auth.services.service import AuthService
from app.features.crowd.services.service import CrowdService
from app.features.navigation.services.service import NavigationService
from app.features.emergency.services.service import EmergencyService
from app.features.volunteer.services.service import VolunteerService
from app.features.sustainability.services.service import SustainabilityService
from app.features.reports.services.service import ReportsService
from app.features.assistant.services.ai_service import ai_service

# DI dependencies helpers
from app.features.auth.presentation.routes import RoleChecker
from app.features.assistant.presentation.schemas import ChatRequest


@pytest.mark.asyncio
async def test_all_services_clean_architecture(db_session):
    # Setup concrete repositories
    auth_repo = SQLAuthRepository(db_session)
    crowd_repo = SQLCrowdRepository(db_session)
    nav_repo = SQLNavigationRepository(db_session)
    incident_repo = SQLIncidentRepository(db_session)
    volunteer_repo = SQLVolunteerRepository(db_session)
    sustain_repo = SQLSustainabilityRepository(db_session)
    reports_repo = SQLReportsRepository(db_session)

    # Setup services
    auth_service = AuthService(auth_repo)
    crowd_service = CrowdService(crowd_repo)
    nav_service = NavigationService(nav_repo)
    emergency_service = EmergencyService(incident_repo)
    volunteer_service = VolunteerService(volunteer_repo)
    sustain_service = SustainabilityService(sustain_repo)
    reports_service = ReportsService(
        reports_repo, incident_repo, volunteer_repo, sustain_repo
    )

    # 1. Seeding default data check (sustainability & volunteer default seeds)
    seeded_metrics = await sustain_service.list_metrics()
    assert len(seeded_metrics) >= 1

    seeded_tasks = await volunteer_service.list_tasks(
        user_role="organizer", user_id=999
    )
    assert len(seeded_tasks) >= 1

    # 2. Auth service operations
    user_dto = await auth_service.signup(
        email="new_unit@fifa.com",
        password="strongpassword",
        full_name="Match Coordinator",
        role="organizer",
    )
    assert user_dto.email == "new_unit@fifa.com"

    # login successful
    token_dto = await auth_service.login(
        email="new_unit@fifa.com", password="strongpassword"
    )
    assert token_dto.access_token is not None

    # login fails
    with pytest.raises(Exception):
        await auth_service.login(email="new_unit@fifa.com", password="wrong")

    # get profile by ID
    profile = await auth_service.get_by_id(user_dto.id)
    assert profile.full_name == "Match Coordinator"

    # 3. Crowd alerts operations
    alert = await crowd_service.log_alert(
        sector="North Stand",
        congestion_level="high",
        spectator_count=13000,
        capacity=15000,
        message="Congested plaza",
    )
    assert alert.sector == "North Stand"

    alerts = await crowd_service.list_alerts()
    assert len(alerts) >= 1

    predictions = await crowd_service.get_congestion_predictions()
    assert "predictions" in predictions.model_fields

    # 4. Navigation operations
    nodes = await nav_service.list_nodes()
    assert len(nodes) >= 3

    new_node = await nav_service.add_node(
        name="Concessions North",
        node_type="concession",
        accessibility_friendly=True,
        lat=40.812,
        lng=-74.073,
        sector="North Stand",
        details="Hotdogs",
    )
    assert new_node.name == "Concessions North"

    route = await nav_service.calculate_path(nodes[0].id, nodes[1].id, True, True)
    assert route.accessibility_mode is True

    # 5. Emergency incidents operations
    incident = await emergency_service.report_incident(
        category="medical",
        severity="high",
        description="Fainted fan",
        location="Sector East",
        reported_by_id=user_dto.id,
    )
    assert incident.category == "medical"
    assert incident.response_instructions is not None

    incidents_list = await emergency_service.list_incidents()
    assert len(incidents_list) >= 1

    resolved = await emergency_service.resolve_incident(incident.id)
    assert resolved.status == "resolved"

    # 6. Volunteer duties operations
    task = await volunteer_service.create_task(
        title="Escort duties",
        description="Guide accessibility tickets",
        priority="high",
        sector="West Stand",
        shift_start=datetime.datetime.now(datetime.timezone.utc),
        shift_end=datetime.datetime.now(datetime.timezone.utc)
        + datetime.timedelta(hours=2),
    )
    assert task.title == "Escort duties"

    tasks_list = await volunteer_service.list_tasks(
        user_role="volunteer", user_id=user_dto.id
    )
    assert len(tasks_list) >= 1

    updated = await volunteer_service.update_task(
        task.id, "organizer", user_dto.id, status="active"
    )
    assert updated.status == "active"

    # 7. Sustainability operations
    metric = await sustain_service.log_metric(
        sector="West Stand",
        power_kwh=100.0,
        water_liters=100.0,
        waste_kg=100.0,
        recycling_rate=0.85,
    )
    assert metric.recycling_rate == 0.85

    summary = await sustain_service.get_summary()
    assert "carbon_offset_kg" in summary.model_fields

    # 8. Reports compilation operations
    report = await reports_service.generate_report("daily", user_dto.id)
    assert "daily" in report.report_type

    reports_list = await reports_service.list_reports()
    assert len(reports_list) >= 1

    # 9. Role Validation DIs unit checks
    from app.features.auth.services.dtos import UserDTO

    mock_user_dto = UserDTO(
        id=user_dto.id,
        email=user_dto.email,
        full_name=user_dto.full_name,
        role="spectator",
        is_active=True,
        created_at=user_dto.created_at,
    )
    checker = RoleChecker(allowed_roles=["organizer"])
    with pytest.raises(Exception):
        checker(mock_user_dto)

    # 10. AI Service logic unit check
    chat_res = await ai_service.get_chat_response(
        ChatRequest(message="Where is elevator 3?")
    )
    assert chat_res.flagged is False

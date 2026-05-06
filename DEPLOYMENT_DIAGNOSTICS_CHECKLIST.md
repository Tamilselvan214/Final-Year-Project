# Deployment Diagnostics Checklist

Status legend: `[ ]` not started, `[~]` in progress, `[x]` passed, `[!]` failed or needs attention.

## Repository Root

- [x] `render.yaml` declares backend and frontend services correctly.
- [~] `DEPLOY_RENDER.md` matches current Render settings.
- [~] `FABRIC_DEMO_RUNBOOK.md` matches current Fabric setup flow.
- [~] `FABRIC_INTEGRATION.md` matches current chaincode/backend contract names.
- [!] `TODO.md` still has deploy-risk unresolved items.

## Fabric Chaincode

- [x] `fabric-chaincode/land-registry-java/pom.xml` resolves dependencies and produces a runnable shaded jar.
- [x] `fabric-chaincode/land-registry-java/src/main/java/com/landregistry/chaincode/LandRegistryContract.java` compiles.
- [x] `LandRegistryContract.java` validates function arguments consistently.
- [x] `LandRegistryContract.java` rejects blank land IDs and owner IDs.
- [x] `LandRegistryContract.java` writes deterministic ledger payloads where possible.
- [x] `LandRegistryContract.java` supports the backend transaction names: `createLandRecord`, `transferLand`, `getLandHistory`.
- [x] `LandRegistryContract.java` supports direct read diagnostics via `readLand`.
- [x] `LandRegistryContract.java` history payload matches backend DTO expectations.
- [x] `LandRecord.java` JSON fields match backend expectations.
- [x] `LandHistoryEntry.java` JSON fields match backend expectations.

## Backend

- [x] `Land-Registry-Backend/pom.xml` resolves dependencies.
- [x] Backend compiles with Java 17.
- [x] Backend tests pass or no tests are present.
- [x] `application.properties` uses environment variables for deploy-sensitive values.
- [x] `application-fabric-demo.properties` enables Fabric only for the demo profile.
- [x] `FabricGatewayProperties.java` binds all Fabric settings.
- [x] `FabricGatewayService.java` validates Fabric configuration before connecting.
- [x] `FabricGatewayService.java` submits chaincode transactions with the expected names and arguments.
- [x] Controllers expose expected auth, land, transfer, and history APIs.
- [x] Security config allows login/register and protects private APIs.
- [x] Dockerfile can build and run the backend jar.

## Frontend

- [x] `Land-Registry-Frontend/package.json` scripts are valid.
- [x] Frontend dependencies install from `package-lock.json`.
- [x] Frontend lint passes.
- [x] Frontend production build passes.
- [x] `src/services/api.js` uses `VITE_API_BASE_URL`.
- [!] Auth flow includes an insecure public reset-password path.
- [!] Land registration still trusts client-provided owner ID.
- [!] Dashboard still has mock fallback/static values that can mask backend failures.
- [x] Static deployment fallback route is configured in `render.yaml`.

## Deployment Readiness

- [~] Backend has deploy-time `MONGODB_URI`.
- [~] Backend has deploy-time `JWT_SECRET`.
- [~] Backend has deploy-time `CORS_ALLOWED_ORIGINS` matching frontend origin.
- [~] Frontend has deploy-time `VITE_API_BASE_URL` matching backend origin.
- [x] Fabric deploy mode is intentionally disabled on Render.
- [ ] Local Fabric demo network can install, approve, commit, and invoke the chaincode.
- [ ] End-to-end smoke test covers register, verify, transfer, and history.

## Complete File Inventory

- [x] `render.yaml`
- [~] `DEPLOY_RENDER.md`
- [~] `FABRIC_DEMO_RUNBOOK.md`
- [~] `FABRIC_INTEGRATION.md`
- [!] `TODO.md`
- [x] `fabric-chaincode/land-registry-java/pom.xml`
- [x] `fabric-chaincode/land-registry-java/src/main/java/com/landregistry/chaincode/LandRegistryContract.java`
- [x] `fabric-chaincode/land-registry-java/src/main/java/com/landregistry/chaincode/LandRecord.java`
- [x] `fabric-chaincode/land-registry-java/src/main/java/com/landregistry/chaincode/LandHistoryEntry.java`
- [x] `Land-Registry-Backend/Dockerfile`
- [x] `Land-Registry-Backend/env.render.example`
- [x] `Land-Registry-Backend/pom.xml`
- [x] `Land-Registry-Backend/src/main/resources/application.properties`
- [x] `Land-Registry-Backend/src/main/resources/application-fabric-demo.properties`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/LandRegistryBackendApplication.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/config/FabricGatewayProperties.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/controller/AuthController.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/controller/HistoryController.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/controller/LandController.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/controller/TransferController.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/dto/AuthResponse.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/dto/LandHistoryResponse.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/dto/LandRegistrationRequest.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/dto/LandResponse.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/dto/LoginRequest.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/dto/RegisterRequest.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/model/Land.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/model/LandHistory.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/model/TransferRequest.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/model/User.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/repository/LandHistoryRepository.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/repository/LandRepository.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/repository/TransferRequestRepository.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/repository/UserRepository.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/security/JwtAuthenticationFilter.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/security/JwtUtil.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/security/SecurityConfig.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/service/AuthService.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/service/FabricGatewayService.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/service/LandHistoryService.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/service/LandService.java`
- [x] `Land-Registry-Backend/src/main/java/com/landregistry/backend/service/TransferService.java`
- [x] `Land-Registry-Frontend/README.md`
- [x] `Land-Registry-Frontend/env.render.example`
- [x] `Land-Registry-Frontend/eslint.config.js`
- [x] `Land-Registry-Frontend/index.html`
- [x] `Land-Registry-Frontend/package-lock.json`
- [x] `Land-Registry-Frontend/package.json`
- [x] `Land-Registry-Frontend/postcss.config.js`
- [x] `Land-Registry-Frontend/tailwind.config.js`
- [x] `Land-Registry-Frontend/vite.config.js`
- [x] `Land-Registry-Frontend/public/vite.svg`
- [x] `Land-Registry-Frontend/src/App.css`
- [x] `Land-Registry-Frontend/src/App.jsx`
- [x] `Land-Registry-Frontend/src/assets/react.svg`
- [x] `Land-Registry-Frontend/src/components/AnalyticsDashboard.jsx`
- [x] `Land-Registry-Frontend/src/components/Chatbot.jsx`
- [x] `Land-Registry-Frontend/src/components/HistoryModal.jsx`
- [x] `Land-Registry-Frontend/src/components/LandList.jsx`
- [x] `Land-Registry-Frontend/src/components/LandRegistrationForm.jsx`
- [x] `Land-Registry-Frontend/src/components/MapView.jsx`
- [x] `Land-Registry-Frontend/src/components/Navbar.jsx`
- [x] `Land-Registry-Frontend/src/components/ProtectedRoute.jsx`
- [x] `Land-Registry-Frontend/src/components/Sidebar.jsx`
- [x] `Land-Registry-Frontend/src/components/TransferModal.jsx`
- [x] `Land-Registry-Frontend/src/components/TransferVerificationList.jsx`
- [x] `Land-Registry-Frontend/src/context/AuthContext.jsx`
- [x] `Land-Registry-Frontend/src/context/useAuth.js`
- [x] `Land-Registry-Frontend/src/index.css`
- [x] `Land-Registry-Frontend/src/main.jsx`
- [x] `Land-Registry-Frontend/src/pages/Dashboard.jsx`
- [x] `Land-Registry-Frontend/src/pages/Login.jsx`
- [x] `Land-Registry-Frontend/src/services/api.js`
- [x] `Land-Registry-Frontend/src/services/authService.js`
- [x] `Land-Registry-Frontend/src/services/landService.js`

package com.landregistry.backend.service;

import com.landregistry.backend.dto.LandHistoryResponse;
import com.landregistry.backend.model.LandHistory;
import com.landregistry.backend.repository.LandHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LandHistoryService {

    private final LandHistoryRepository repository;
    private final FabricGatewayService fabricGatewayService;

    public LandHistoryService(LandHistoryRepository repository, FabricGatewayService fabricGatewayService) {
        this.repository = repository;
        this.fabricGatewayService = fabricGatewayService;
    }

    public void logAction(String landId, String previousOwnerId, String newOwnerId, String action) {
        LandHistory history = new LandHistory(landId, previousOwnerId, newOwnerId, action);
        repository.save(history);
    }

    public List<LandHistoryResponse> getHistory(String landId) {
        if (fabricGatewayService.isEnabled()) {
            try {
                List<LandHistoryResponse> fabricHistory = fabricGatewayService.getLandHistory(landId);
                if (!fabricHistory.isEmpty()) {
                    return fabricHistory;
                }
            } catch (ResponseStatusException exception) {
                // Fall back to locally persisted history when Fabric is unavailable.
            }
        }

        return getLocalHistory(landId);
    }

    private List<LandHistoryResponse> getLocalHistory(String landId) {
        return repository.findByLandIdOrderByTimestampDesc(landId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private LandHistoryResponse toResponse(LandHistory history) {
        return new LandHistoryResponse(
                history.getId(),
                history.getLandId(),
                history.getPreviousOwnerId(),
                history.getNewOwnerId(),
                history.getTimestamp() == null ? null : history.getTimestamp().toString(),
                history.getAction(),
                null
        );
    }
}

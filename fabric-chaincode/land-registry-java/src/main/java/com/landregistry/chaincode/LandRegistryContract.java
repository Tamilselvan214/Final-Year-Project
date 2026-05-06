package com.landregistry.chaincode;

import com.google.gson.Gson;
import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ledger.KeyModification;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;

import java.util.ArrayList;
import java.util.List;

@Contract(name = "landregistry")
@Default
public class LandRegistryContract implements ContractInterface {
    private final Gson gson = new Gson();

    @Transaction
    public String createLandRecord(Context context, String landId, String ownerId) {
        ChaincodeStub stub = context.getStub();
        String normalizedLandId = requireText(landId, "landId");
        String normalizedOwnerId = requireText(ownerId, "ownerId");

        String existingRecord = stub.getStringState(normalizedLandId);
        if (existingRecord != null && !existingRecord.isBlank()) {
            throw new ChaincodeException("Land record already exists for id " + normalizedLandId);
        }

        LandRecord record = new LandRecord(
                normalizedLandId,
                normalizedOwnerId,
                "",
                "REGISTERED_AND_VERIFIED",
                stub.getTxTimestamp().toString()
        );

        stub.putStringState(normalizedLandId, gson.toJson(record));
        return gson.toJson(record);
    }

    @Transaction
    public String transferLand(Context context, String landId, String oldOwner, String newOwner) {
        ChaincodeStub stub = context.getStub();
        String normalizedLandId = requireText(landId, "landId");
        String normalizedOldOwner = requireText(oldOwner, "oldOwner");
        String normalizedNewOwner = requireText(newOwner, "newOwner");

        LandRecord currentRecord = getExistingLandRecord(stub, normalizedLandId);

        if (!currentRecord.getOwnerId().equals(normalizedOldOwner)) {
            throw new ChaincodeException("Current owner mismatch for land " + normalizedLandId);
        }

        LandRecord updatedRecord = new LandRecord(
                normalizedLandId,
                normalizedNewOwner,
                normalizedOldOwner,
                "TRANSFERRED",
                stub.getTxTimestamp().toString()
        );

        stub.putStringState(normalizedLandId, gson.toJson(updatedRecord));
        return gson.toJson(updatedRecord);
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String readLand(Context context, String landId) {
        ChaincodeStub stub = context.getStub();
        LandRecord record = getExistingLandRecord(stub, requireText(landId, "landId"));
        return gson.toJson(record);
    }

    @Transaction(intent = Transaction.TYPE.EVALUATE)
    public String getLandHistory(Context context, String landId) {
        ChaincodeStub stub = context.getStub();
        String normalizedLandId = requireText(landId, "landId");
        getExistingLandRecord(stub, normalizedLandId);

        List<LandHistoryEntry> historyEntries = new ArrayList<>();
        try (QueryResultsIterator<KeyModification> history = stub.getHistoryForKey(normalizedLandId)) {
            for (KeyModification modification : history) {
                if (modification.isDeleted()) {
                    continue;
                }

                LandRecord record = gson.fromJson(modification.getStringValue(), LandRecord.class);
                historyEntries.add(new LandHistoryEntry(
                        modification.getTxId(),
                        normalizedLandId,
                        record.getPreviousOwnerId(),
                        record.getOwnerId(),
                        modification.getTimestamp().toString(),
                        record.getAction()
                ));
            }
        } catch (Exception exception) {
            throw new ChaincodeException("Failed to read land history for id " + normalizedLandId, exception);
        }

        return gson.toJson(historyEntries);
    }

    private LandRecord getExistingLandRecord(ChaincodeStub stub, String landId) {
        String normalizedLandId = requireText(landId, "landId");
        String json = stub.getStringState(normalizedLandId);
        if (json == null || json.isBlank()) {
            throw new ChaincodeException("Land record does not exist for id " + normalizedLandId);
        }

        return gson.fromJson(json, LandRecord.class);
    }

    private String requireText(String value, String argumentName) {
        if (value == null || value.isBlank()) {
            throw new ChaincodeException(argumentName + " must not be blank");
        }
        return value.trim();
    }
}

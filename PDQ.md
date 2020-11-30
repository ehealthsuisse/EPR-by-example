# Patient Demographics Query 

Transaction to search for patient identities and data from a community using the patient demographic data as search criteria. Primary systems may use this transaction to verify if a patient uses a Swiss EPR and is already registered in the community.  

# Overview

Primary systems may use this transaction to search for patients which are already registred in the community, either because the patient opended the Swiss EPR in the community or because the patient opended the Swiss EPR in a remote community and was already registered by annother primary system to store documents. In the Swiss EPR the **[IHE PDQV3](https://profiles.ihe.net/ITI/TF/Volume1/ch-24.html)** profile and transactions shall be used to search for patients by demographic data. 

To search for patients the primary system shall perform a **[Patient Demographic Query \[ITI-47\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html)**. Within the query request the primary system shall provide the demographic data as search criteria. In the Swiss EPR each community must support the name, birthdate, gender and nationality. Individual communities may support other demographic data (e.g., address and other contact data).  

The community sends a response with all patient data sets matching the search criteria. Each patient data set contains the known demographic data, the EPR-SPID and the assigned ID. The response contains the master data set as well as all known patient data sets, as registered by other primary systems.    

# Transaction 

TBD

## Message Semantics

### Request Message

TBD

### Response Message

TBD

### Protocol Message

TBD

```
code block here    
```

## Transport Protocol

TBD 

## Security Requirements  

TBD

# Test Opportunity

TBD
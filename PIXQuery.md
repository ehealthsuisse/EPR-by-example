# PIX Query 
Transaction to get the master patient ID of a patient in a community using the local ID. 

# Overview

Primary systems shall use this transaction to retrieve the master patient ID (XAD-SPID) for patients the primary systems wants 
to retrieve or provide documents for. In the Swiss EPR the **[IHE PIX V3](https://profiles.ihe.net/ITI/TF/Volume1/ch-23.html)** 
profile and transactions shall be used to retrieve the master patient ID.  

To retrieve the master patient ID for the patient to access the patients EPR, the the primary system shall perform a 
**[Patient V3 Query \[ITI-45\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-45.html)**. Within the query request the 
primary system shall provide the local ID of the patient in the primary system, as well as the *data source* parameter 
of the assigning authority of the community and the the assigning authority EPR-SPID. The local ID must match the local 
ID the primary system registered the patient with (see **[PIX Feed](../main/PIXFeed.md)**).  

If the patient is registered in the community, the community sends a response with the master patient ID (XAD-PID) and 
the EPR-SPID.

# Transaction 

TBD

## Message Semantics

TBD

### Request Message

TBD

### Response Message

TBD

## Transport Protocol 

TBD 

## Audit Log

TBD

```
code block here    
```


## Security Requirements    

TBD

# Test Opportunity

TBD
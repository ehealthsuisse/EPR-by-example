# PIX Feed

Transaction to register a patient in a community. Primary systems shall use this transaction to register patient data to be able to provide and retrieve documents to the patients EPR. 

# Overview

Primary systems shall use this transaction to register patient data with the local ID, the patient is registered in the primary system. In the Swiss EPR the **[IHE PIX V3](https://profiles.ihe.net/ITI/TF/Volume1/ch-23.html)** profile and transactions shall be used to register the patient data.  

To register the patient data the primary system shall perform a **[Patient Identity Feed HL7 V3 \[ITI-44\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-44.html)** transaction. In the feed request the primary system must provide the demographic data as provided by the ZAS central service, which includes the name, birthdate, gender, nationality and the EPR-SPID. Primary systems may provide other demographic data (e.g., address and other contact data). 

The community response includes either a success confirmation, or a error code in the case an error occured in the community during registration. In the success case the community stores the patient data provided by the primary system, matches the data set to other patient data set registered by other primary systems and assigns the patient data set to a master patient record and the master patient ID (XAD-PID).

To perform the PIX V3 feed fo the EPR, primary systems must retrieve the demographic data and the EPR-SPID from the ZAS central service. While the interface to be used by the communities is specified in the ordinances to the Swiss electronic patient dossier, the interface for primary systems is not, since communities provide simplified interfaces for primary systems to retrieve the data or included the interface in the registration workflow. Please contact the community you want to connect to on implementation details.   
 

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
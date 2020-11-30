# Registry Stored Query
Transaction to lookup the document metadata in a community.

# Overview

Primary systems shall use this transaction to retrieve the document metadata for the documents stored in a patients EPR. In the Swiss EPR the **[IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html)** profile and transactions shall be used to retrieve the document metadata.  

To retrieve the document metadata of the doczûmet stored in a patients EPR, the the primary system shall perform a **[Registry Stored Query \[ITI-18\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html#3.18)**. The Registry Stored Query [ITI-18] supports various query parameter as search and filter parameter. The most common parameter used in the Swiss EPR are the patient ID in CX format and the status information, which must be *Approved*. 

The community responds with the metadata sets of all documents registered in the patient's EPR, which match the search and filter parameter of the query. The profile is based upon the ebXML standard. Due to the genericity of the ebXML standard, the response is not human readable and needs some background information on how to interpret.

The structure of the result set is as follows (see example below): 
- The metadata of the individual documents are bundled in a *ExtrinsicObject* XML schema.
- The metadata attributes are encoded either as *Slot*, as *Classification* or the *ExternalIdentifier* schema. 
- Metadata attributes encoded as *Slots* can be identified by the slot's *name* attribute. 
- Metadata attributes encoded as *Classification* can be identified by the classification's *classificationScheme* attribute.
- The unique ID of the document is encoded as *ExternalIdentifier*, which has an *identificationScheme* attribute with a fixed value.

The full table of the indentifier used to indicate the metadata attributes is defined by the metadat model used by IHE XDS.b in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)**. The corresponding interpretation in the Swiss EPR may be found in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)** of the ordinances of the Swiss electronic patient dossier.   


# Transaction 

TBD

## Message 

TBD

## Transport 

TBD 

## Security   

TBD

# Test Opportunity

TBD
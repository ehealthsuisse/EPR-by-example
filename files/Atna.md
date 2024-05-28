# Audit logs

When executing most of the transactions with the EPR, there is a requirement to send an audit log to the community 
describing who did what and when, on the client's side.
The community also creates such an audit log, and both can be compared if the need arises.

Since the audit logs may contain information about the transaction outcome, you have to wait for the community 
response before creating the audit log.

!!! warning
    You have to do your best efforts to send the audit logs, even if the transaction has failed (network issue or 
    error 500 for example).

## Specifications

The base specification of the `#!xml <AuditMessage>` format is given in [DICOM PS3.15](https://dicom.nema.org/medical/dicom/current/output/html/part15.html).
Additional requirements are described in:

- For each transaction, in the 'Security Considerations' section of each transaction profile;
- In the [IHE Audit Trail and Node Authentication (ATNA) Profile](https://profiles.ihe.net/ITI/TF/Volume1/ch-9.html);
- In [IHE ITI-20](https://profiles.ihe.net/ITI/TF/Volume2/ITI-20.html);
- In [IHE ITI-40](https://profiles.ihe.net/ITI/TF/Volume2/ITI-40.html#3.40.4.2) §3.40.4.2;
- In the [Amendment 1 to Annex 5][annexes], §1.5 and §1.6.4.3.5.1;

## Basic structure

An audit log is simply wrapped in a `#!xml <AuditMessage>` element.
No namespace is needed.

The first child is a _EventIdentification_ element that describes the transaction:
```xml
<EventIdentification EventActionCode="★action_code" EventDateTime="★date_time" EventOutcomeIndicator="★outcome">
  <EventID csd-code="★transaction_code" codeSystemName="DCM" originalText="★transaction_display"/>
  <EventTypeCode csd-code="★type_code" codeSystemName="IHE Transactions" originalText="★type_display"/>
</EventIdentification>
```
where:

- `action_code`, `transaction_code`, `transaction_display`,`type_code` and `type_display` depend on the 
  transaction type and are defined in the IHE transaction profile, in the 'Security Considerations' section;
- `date_time` is the date and time at which the transaction was made. It shall be given in UTC, and shall follow the 
  xsd:dateTime format;
- `outcome` describes whether the transaction was successful or not: `0` is a success, `4` is a minor 
  failure, `8` is a serious failure and `12` is a major failure. The choice of the failure type is left to the 
  implementers.

Then two _ActiveParticipants_ describe the source and destination participants.

=== "First _ActiveParticipant_"

    The first _ActiveParticipant_ describes the source participant, which is the one that has sent the transaction.
    It has the following content:
    ```xml
    <ActiveParticipant UserID="★user_id" AlternativeUserID="★alt_user_id" NetworkAccessPointID="★nap_id" NetworkAccessPointTypeCode="★nap_type" UserIsRequest="true">
      <RoleIDCode csd-code="110153" codeSystemName="DCM" originalText="Source Role ID"/>
    </ActiveParticipant>
    ```
    where:

    - `user_id` is required and can be filled as you want. It can be a process ID, a login name, or other identifiers;
    - `alt_user_id` is the process ID as used within the local operating system in the local system logs;
    - `nap_id` is the DNS name or IP address of the source;
    - `nap_type` is `1` for machine (DNS) name, `2` for IP address.
    
    Other attributes are optional.

=== "Second _ActiveParticipant_"

    The second _ActiveParticipant_ describes the destination participant, which is the one that has received the 
    transaction.
    It has the following content:
    ```xml
    <ActiveParticipant UserID="★user_id" NetworkAccessPointID="★nap_id" NetworkAccessPointTypeCode="★nap_type" UserIsRequest="false">
      <RoleIDCode csd-code="110152" codeSystemName="DCM" originalText="Destination Role ID"/>
    </ActiveParticipant>
    ```
    where:

    - `user_id` is the SOAP endpoint URI;
    - `nap_id` is the DNS name or IP address of the destination;
    - `nap_type` is `1` for machine (DNS) name, `2` for IP address.
    
    Other attributes are optional.

Following that is the `#!xml <AuditSourceIdentification>` element.
It contains the following:
```xml
<AuditSourceIdentification AuditEnterpriseSiteID="★oid" />
```
where `oid` is required and must be an OID of your OID hierarchy.
Please ask your community if it has requirements about the use of this OID.
Other attributes are optional.

## Requirements for transactions secured by XUA

If the transaction is secured by XUA (like ITI-18, ITI-41, ITI-43), then additional _ActiveParticipants_ shall be 
specified.

=== "First _ActiveParticipant_"

    The **first additional _ActiveParticipant_** is described in [IHE ITI-40](https://profiles.ihe.net/ITI/TF/Volume2/ITI-40.html#3.40.4.2),
    §3.40.4.2.
    It is required for all roles.
    It shall contain:
    ```xml
    <ActiveParticipant UserID="★user_id" UserName="★alias&lt;★user@★issuer&gt;" UserIsRequest="false" />
    ```
    where:
    
    - `user_id` is required and can be filled as you want. It can be a process ID, a login name, or other identifiers;
    - `alias` (optional) is the SAML Assertion's `#!abnf Subject/NameID/@SPProvidedID` attribute;
    - `user` (required) is the SAML Assertion's `#!abnf Subject/NameID` content;
    - `issuer` (required) is the SAML Assertion's `#!abnf Issuer` content.
    
    The other attributes and subject role specification are optional.

=== "Second _ActiveParticipant_"

    The **second additional _ActiveParticipant_** is described in the [Amendment 1 to Annex 5][annexes], §1.6.4.3.5.1.
    It is required for all roles.
    It shall contain:
    ```xml
    <ActiveParticipant UserID="★user_id" UserName="★user_name" UserIsRequestor="false">
        <RoleIDCode csd-code="★code" codeSystemName="2.16.756.5.30.1.127.3.10.6" originalText="★display"/>
    </ActiveParticipant>
    ```
    where:
    
    - `user_id` (required) is the SAML Assertion's `#!abnf Subject/NameID` content;
    - `user_name` (required) is the SAML Assertion's `#!abnf AttributeStatement/Attribute[@Name="urn:oasis:names:tc:xspa:1.0:subject:subject-id"]/AttributeValue` content;
    - `code` (required) is the SAML Assertion's `#!abnf AttributeStatement/Attribute[@Name="urn:oasis:names:tc:xacml:2.0:subject:role"]/AttributeValue/Role/@code` attribute.

    Other attributes are optional.

=== "Third _ActiveParticipant_"

    The **third additional _ActiveParticipant_** is described in the [Amendment 1 to Annex 5][annexes], §1.6.4.3.5.1.
    It is only required for assistants and technical users.
    It shall contain:
    ```xml
    <ActiveParticipant UserID="★user_id" UserName="★user_name" UserIsRequest="false">
        <RoleIDCode csd-code="★code" codeSystemName="2.16.756.5.30.1.127.3.10.6" originalText="★display" />
    </ActiveParticipant>
    ```
    where:
    
    - `user_id` (required) is the SAML Assertion's `#!abnf Subject/SubjectConfirmation/NameID` content;
    - `user_name` (required) is the SAML Assertion's `#!abnf Subject/SubjectConfirmation/SubjectConfirmationData/AttributeStatement/Attribute[@Name="urn:oasis:names:tc:xspa:1.0:subject:subject-id"]/AttributeValue` content;
    - `code` (required) is either `TCU` or `ASS`.

## Special parts

Some _ParticipantObjectIdentification_ elements may be used to include additional details about the query content.

### Query

For ITI-18 transaction, the query content has to be included in the `#!xml <ParticipantObjectIdentification>` element:
```xml
<ParticipantObjectIdentification ParticipantObjectID="★participant_object_id" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="24">
  <ParticipantObjectIDTypeCode csd-code="★transaction_code" codeSystemName="IHE Transactions" originalText="★transaction_display" />
  <ParticipantObjectQuery>★query_b64</ParticipantObjectQuery>
  <ParticipantObjectDetail type="QueryEncoding" value="★query_encoding_b64" />
</ParticipantObjectIdentification>
```
where:

- `participant_object_id` is the Stored Query ID for ITI-18, or optional for ITI-45 and ITI-47;
- `transaction_code` and `transaction_display` are the same as in `#!abnf EventIdentification/EventID`;
- `query_b64` is the XML representation of a part of the query, base64-encoded:
    - For ITI-18, the `AdhocQueryRequest`;
    - For ITI-45 and ITI-47, the `QueryByParameter` segment of the query;
- `query_encoding_b64` is the query encoding, encoded in base64. Usually `VVRGLTg=` (UTF-8).

For ITI-18 transactions, an additional `#!xml <ParticipantObjectIdentification>` is required inside, if the 
homeCommunityID is specified in the query:
```xml
<ParticipantObjectDetail type="urn:ihe:iti:xca:2010:homeCommunityId" value="★home_community_id_b64" />
```
where `home_community_id_b64` is the value of the homeCommunityId, base64-encoded.

### Patient

```xml
<ParticipantObjectIdentification ParticipantObjectID="★patient_id" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1">
  <ParticipantObjectIDTypeCode csd-code="2" codeSystemName="RFC-3881" originalText="Patient Number" />
</ParticipantObjectIdentification>
```
where `patient_id` is the patient identifier encoded in HL7 CX format (e.g. `value^^^&1.2.3&aISO`).

### Submission set

For ITI-41 requests, a `#!xml <ParticipantObjectIdentification>` is required to describe the Submission Set:
```xml
<ParticipantObjectIdentification ParticipantObjectID="★submission_set_unique_id" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="20">
  <ParticipantObjectIDTypeCode csd-code="urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd" originalText="submission set classificationNode" codeSystemName="IHE XDS Metadata"/>
</ParticipantObjectIdentification>
```
where `submission_set_unique_id` is the URN-encoded Submission Set unique ID.

### Document

For ITI-43 transactions, a `#!xml <ParticipantObjectIdentification>` is required to describe the document to be 
retrieved:
```xml
<ParticipantObjectIdentification ParticipantObjectID="★document_unique_id" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="3" ParticipantObjectSensitivity="★confidentiality_code">
  <ParticipantObjectIDTypeCode csd-code="9" codeSystemName="RFC-3881" originalText="Report Number"/>
  <ParticipantObjectDetail type="Repository Unique Id" value="★repo_unique_id_b64"/>
</ParticipantObjectIdentification>
```
where:

- `document_unique_id` is the document unique ID;
- `repo_unique_id_b64` is the repository unique ID;
- `confidentiality_code` is the document confidentiality code, if known. The format is HL7v2 CE with the code
  system OID as the code (e.g.: `1051000195109^normal^2.16.840.1.113883.6.96`).

If the home community ID is known, another _ParticipantObjectDetail_ is required inside: 
`#!xml <ParticipantObjectDetail type="ihe:homeCommunityID" value="★home_community_id_b64"/>`.
The value must be base64-encoded.

## Requirements summary

<table>
<thead>
  <tr>
    <th></th>
    <th></th>
    <th colspan="3">ActiveParticipant</th>
    <th colspan="4">ParticipantObjectIdentification</th>
  </tr>
  <tr>
    <th>Transaction</th>
    <th>EventIdentification</th>
    <th>Source</th>
    <th>Destination</th>
    <th>XUA</th>
    <th>Query</th>
    <th>Patient</th>
    <th>Submission Set</th>
    <th>Document</th>
  </tr>
</thead>
<tbody>
  <tr><td>ITI-18</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
  <tr><td>ITI-41</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>✅</td><td>❌</td></tr>
  <tr><td>ITI-43</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>❌</td><td>✅</td></tr>
  <tr><td>ITI-44</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td><td>✅</td><td>❌</td><td>❌</td></tr>
  <tr><td>ITI-45</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
  <tr><td>ITI-47</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
  <tr><td>ITI-57</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>✅</td><td>❌</td></tr>
</tbody>
</table>

## Sending an audit log

[Amendment 1 to Annex 5][annexes], §1.5.1

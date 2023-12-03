# Medication Card document

In a primary system, different medications are documented in a treatment context. Primary systems can use this Exchange Format to generate a Medication Card document with the help of the Content Creator.

## Bundle
[Profile information](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-composition-medicationcard.html)

In the resource "Bundle", all resources are collected in a container.

* *id:* Local id of the resource (line 3)
* *meta:* Shows the metadata of the document (line 4 to 9).
* *identifier:* Unique identifier for the bundle - fixed Value: "*urn:ietf:rfc:3986*" (line 10 to 13).
* *type:* Indicates the purpose of this bundle - fixed Value: "*document*"; binding: *[BundleType](http://hl7.org/fhir/R4/valueset-bundle-type.html)* (line 14).
* *timestamp:* The date/time the bundle was composed (line 15).
* *entry:* The list to add all resources belonging to the document (line 16-18).

```json linenums="1"
  {
    "resourceType" : "Bundle",
    "id" : "2-7-MedicationCard",
    "meta" : {
      "lastUpdated" : "2020-02-21T12:31:59.738+00:00",
      "profile" : [
        "http://fhir.ch/ig/ch-emed/StructureDefinition/ch-emed-document-medicationcard"
     ]
   },
  "identifier" : {
    "system" : "urn:ietf:rfc:3986",
    "value" : "urn:uuid:6b6ed376-a7da-44cb-92d1-e75ce1ae73b0"
  },
  "type" : "document",
  "timestamp" : "2012-02-04T14:05:00+01:00",
  "entry" : [
    {
      "fullUrl" : "http://test.fhir.ch/r4/Composition/2-7-MedicationCard",
```

## Composition
[Profile information](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-composition-medicationcard.html)

In the resource "Composition", general information about the document is specified.

* *entry:* An entry in a bundle resource - will either contain a resource or information about a resource (line 1)
* *id:* Local id of the resource (line 6).
* *language:* Specifies the language of the document - binding: *[CommonLanguages](http://hl7.org/fhir/R4/valueset-languages.html)* (line 7).
* *text:* Presents the narrative text of the resource (line 8 to 11).
* *extension:* Extension to Information Recipient (line 12 to 19).
* *identifier:* A version-independent identifier for the Composition (line 20 to 23).
* *status:* The status of the document - fixed Value: "*final*"; binding: *[CompositionStatus](http://hl7.org/fhir/R4/valueset-composition-status.html)* (line 24).
* *type:* Specifies the particular kind of composition - binding: *[DocumentEntry.typeCode](http://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.typeCode.html)*(line 25 to 38).

```json  linenums="1"
  "entry" : [
    {
      "fullUrl" : "http://test.fhir.ch/r4/Composition/2-7-MedicationCard",  
      "resource" : {
        "resourceType" : "Composition",
        "id" : "2-7-MedicationCard",
        "language" : "de-CH",
        "text" : {
          "status" : "extensions",
         "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"de-CH\" lang=\"de-CH\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"2-7-MedicationCard\"  (Language \"de-CH\") </p></div><p><b>EPR Information Recipient</b>: <a href=\"#Patient_MonikaWegmuellerRecipient\">See above (Patient/MonikaWegmuellerRecipient)</a></p><p><b>identifier</b>: id: urn:uuid:6b6ed376-a7da-44cb-92d1-e75ce1ae73b0</p><p><b>status</b>: final</p><p><b>type</b>: Medication summary <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://loinc.org/\">LOINC</a>#56445-0; <a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#721912009\"Medication summary document (record artifact)\")</span></p><p><b>date</b>: 2012-02-04T14:05:00+01:00</p><p><b>author</b>: </p><ul><li><a href=\"#Practitioner_FamilienHausarzt\">See above (Practitioner/FamilienHausarzt)</a></li><li><a href=\"#Organization_Hausarzt\">See above (Organization/Hausarzt)</a></li></ul><p><b>title</b>: Medikationsplan</p><p><b>confidentiality</b>: N</p><p><b>custodian</b>: <a href=\"#Organization_Custodian\">See above (Organization/Custodian)</a></p></div>"
        },
        "extension" : [
          {
            "url" : "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-informationrecipient",
            "valueReference" : {
             "reference" : "Patient/MonikaWegmuellerRecipient"
            }
          }
        ],
        "identifier" : {
          "system" : "urn:ietf:rfc:3986",
          "value" : "urn:uuid:6b6ed376-a7da-44cb-92d1-e75ce1ae73b0"
        },
        "status" : "final",
        "type" : {
          "coding" : [
            {
              "system" : "http://loinc.org",
              "code" : "56445-0",
              "display" : "Medication summary"
            },
            {
              "system" : "http://snomed.info/sct",
              "code" : "721912009",
              "display" : "Medication summary document (record artifact)"
            }
          ]
        },
```

* *subject:* Who the composition is about. Its a reference to the resource contained as entry in the bundle (line 39 to 44).
* *date* The date of the composition creation (line 42).
* *author:* Identifies who is responsible for the information in the composition (line 43 to 56).
* *extension:* Extension to EPR Time (line 45 to 50).

```json linenums="1"
      "subject": {
         "reference": "Patient/MonikaWegmueller"
       },
       "date": "2012-02-04T14:05:00+01:00",
       "author": [
         {
           "extension": [
             {
               "url": "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-time",
               "valueDateTime": "2012-02-04T13:55:00+01:00"
             }
           ],
           "reference": "Practitioner/FamilienHausarzt"
         },
         {
           "reference": "Organization/Hausarzt"
         }
       ],
```

* *title:* Human readable label for the composition.

```json linenums="1"
       "title": "Medikationsplan",
```

* *confidentiality:* Level of confidentiality of the Composition - binding: *[v3.ConfidentialityClassification (2014-03-26)](http://hl7.org/fhir/R4/v3/ConfidentialityClassification/vs.html)*.
* extension *[EPR Confidentiality Code](http://fhir.ch/ig/ch-core/StructureDefinition-ch-ext-epr-confidentialitycode.html)*

```json linenums="1"
       "confidentiality": "N",
       "_confidentiality": {
         "extension": [
           {
             "url": "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-confidentialitycode",
             "valueCodeableConcept": {
               "coding": [
                 {
                   "system": "http://snomed.info/sct",
                   "code": "17621005",
                   "display": "Normally accessible"
                 }
               ]
             }
           }
         ]
       },
```

* *custodian:* Organization who is responsible for the document and access.

```json linenums="1"
       "custodian": {
         "reference": "Organization/Custodian"
       },
```

* *section:* The root of the sections that make up the composition.

```json linenums="1"
       "section": [
         {
           "title": "Medikamentenliste",
           "code": {
             "coding": [
               {
                 "system": "http://loinc.org",
                 "code": "10160-0",
                "display": "History of medication use"
               }
             ]
           },
           "entry": [
             {
               "reference": "MedicationStatement/2-7-MedStatBeloczok"
             },
             {
               "reference": "MedicationStatement/2-7-MedStatNorvasc"
             }
           ]
         },
         {
           "title": "Kommentar",
           "code": {
             "coding": [
               {
                 "system": "http://loinc.org",
                 "code": "48767-8",
                 "display": "Annotation comment"
               }
             ]
           },
           "text": {
             "status": "generated",
             "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n              <span id=\"co1\">\n                  Kommentar zu Medication Treatment\n              </span>\n            </div>"
           }
         },
         {
           "title": "Original Darstellung",
           "code": {
             "coding": [
               {
                 "system": "http://loinc.org",
                 "code": "55108-5",
                 "display": "Clinical presentation"
               }
             ]
           },
           "text": {
             "status": "generated",
             "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n              <a href=\"Binary/2-7-pdf\">Representation of the original view</a>\n            </div>"
           },
           "entry": [
             {
               "reference": "Binary/2-7-pdf"
             }
           ]
         }
       ]
     }
   },
```

## Information about the patient

In the "Patient" resource, the demographic and administrative data of a patient are specified.

[Profile information](http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-patient-epr.html)


```json linenums="1"
  "resource": {
      "resourceType": "Patient",
      "id": "MonikaWegmueller",
      "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><p><b>identifier</b>: Medical record number: 11111111</p><p><b>name</b>: Monika Wegmüller </p><p><b>gender</b>: female</p><p><b>birthDate</b>: 1943-05-15</p><p><b>address</b>: Wiesenstr. 12 Zürich 8003 CH </p></div>"
      },
     "identifier": [
        {
          "type": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                "code": "MR"
              }
            ]
          },
          "system": "urn:oid:2.999",
          "value": "11111111"
        }
      ],
      "name": [
        {
          "family": "Wegmüller",
          "given": [
            "Monika"
          ]
        }
      ],
      "gender": "female",
      "birthDate": "1943-05-15",
      "address": [
        {
          "line": [
            "Wiesenstr. 12"
          ],
          "city": "Zürich",
          "postalCode": "8003",
          "country": "CH"
        }
      ]
    }
  },
```

## Information about the practitioner

The resource Practitioner indicates which practitioner has prescribed a medication.

[Profile information](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-practitionerrole.html)

```json linenums="1"
 "resource" : {
      "resourceType" : "Practitioner",
      "id" : "FamilienHausarzt",
      "text" : {
        "status" : "generated",
        "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"FamilienHausarzt\" </p></div><p><b>identifier</b>: id: 7601000234438</p><p><b>name</b>: Familien Hausarzt </p><p><b>address</b>: Krankenstrasse 2 Zürich 8005 CH </p></div>"
      },
      "identifier" : [
        {
          "system" : "urn:oid:2.51.1.3",
          "value" : "7601000234438"
        }
      ],
      "name" : [
        {
          "family" : "Hausarzt",
          "given" : [
            "Familien"
          ]
        }
      ],
      "address" : [
        {
          "line" : [
            "Krankenstrasse 2"
          ],
          "city" : "Zürich",
          "postalCode" : "8005",
          "country" : "CH"
        }
      ]
    }
```

## Information about the organization

The resource stores the information about the organization that create the Medication Card document.

[Profile information](http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-organization-epr.html)

```json linenums="1"
 "resource" : {
      "resourceType" : "Organization",
      "id" : "Hausarzt",
      "text" : {
        "status" : "generated",
        "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"Hausarzt\" </p></div><p><b>identifier</b>: id: 7601000234438</p><p><b>name</b>: Hausarzt</p><p><b>address</b>: Krankenstrasse 2 Zürich 8005 CH </p></div>"
      },
      "identifier" : [
        {
          "system" : "urn:oid:2.51.1.3",
          "value" : "7601000234438"
        }
      ],
      "name" : "Hausarzt",
      "address" : [
        {
          "line" : [
            "Krankenstrasse 2"
          ],
          "city" : "Zürich",
          "postalCode" : "8005",
          "country" : "CH"
        }
      ]
    }
```

## Medication

In the resource "MedicationStatement" the data of the patient's medication are specified.

[Profile information](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-medicationstatement-card.html)

### Medication information

* *id:* Local id of the resource (line 2).
* *text:* Presents the narrative text of the resource (line 3, 19, 54).
* *contained:* The resource cannot be identified independently and therefore cannot exist independently apart from the resource it contains (line 7 to 73).
* *code:* A code (or set of codes) that specify this medication, or a textual description if no code is available. (line 11, 25, 35, 41, 50, 67).
* *coding* A reference to a code defined by a terminology system. (line 12,22, 47).
* *form* Describes the form of the medication. Powder; tablets; capsule. (line 21 to 29).
* *amount:* A relationship of two Quantity values - expressed as a numerator and a denominator. (line 30 to 36).
* *ingredient:*  Particular ingredient of a medication (line 44 to 71).
* *strength:* A relationship of two Quantity values - expressed as a numerator and a denominator (line 56 to 69).

```json linenums="1"
 "resourceType": "MedicationStatement",
        "id": "2-7-MedStatBeloczok",
        "text": {
          "status": "extensions",
          "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><blockquote><p><b>CH EMED Extension Treatment Plan</b></p><h3>Urls</h3><table class=\"grid\"><tr><td>-</td></tr><tr><td>*</td></tr></table><p><b>value</b>: id: urn:uuid:5712fffe-20c6-11e6-b67b-9e71128cae77</p><h3>Urls</h3><table class=\"grid\"><tr><td>-</td></tr><tr><td>*</td></tr></table><p><b>value</b>: id: urn:uuid:5712fffe-20c6-11e6-b67b-9e71128cae77</p></blockquote><p><b>identifier</b>: id: urn:uuid:d0f885ca-afa6-4e7e-905d-f7698f9607aa</p><p><b>status</b>: completed</p><p><b>medication</b>: <a name=\"med\"> </a></p><blockquote><p><b>code</b>: <span title=\"Codes: {urn:oid:2.51.1.1 7680521101306}\">BELOC ZOK Ret Tabl 50 mg</span></p><p><b>form</b>: <span title=\"Codes: {urn:oid:0.4.0.127.0.16.1.1.2.1 10219000}\">Tablet</span></p><p><b>amount</b>: 30 Tablet (unit of presentation)/1 Package</p><h3>Ingredients</h3><table class=\"grid\"><tr><td>-</td><td><b>Item[x]</b></td><td><b>Strength</b></td></tr><tr><td>*</td><td><span title=\"Codes: {http://snomed.info/sct 372826007}\">Metoprolol</span></td><td>50 milligram/1 Tablet (unit of presentation)</td></tr></table></blockquote><p><b>subject</b>: <a href=\"#Patient_MonikaWegmueller\">See above (Patient/MonikaWegmueller)</a></p><p><b>reasonCode</b>: <span title=\"Codes: \">Bluthochdruck</span></p><p><b>note</b>: -</p><h3>Dosages</h3><table class=\"grid\"><tr><td>-</td></tr><tr><td>*</td></tr><tr><td>*</td></tr><tr><td>*</td></tr></table></div>"
        },
        "contained": [
          {
            "resourceType": "Medication",
           "id": "med",
           "code": {
             "coding": [
               {
                 "system": "urn:oid:2.51.1.1",
                 "code": "7680521101306",
               "display": "BELOC ZOK Ret Tabl 50 mg 30 Stk"
             }
           ],
           "text": "BELOC ZOK Ret Tabl 50 mg"
         },
         "form": {
           "coding": [
             {
               "system": "urn:oid:0.4.0.127.0.16.1.1.2.1",
               "code": "10219000",
               "display": "Tablet"
             }
           ]
         },
         "amount": {
           "numerator": {
             "value": 30,
             "unit": "Tablet (unit of presentation)",
             "system": "http://snomed.info/sct",
             "code": "732936001"
           },
           "denominator": {
             "value": 1,
             "unit": "Package",
             "system": "http://unitsofmeasure.org",
             "code": "{Package}"
             }
           },
           "ingredient": [
             {
               "itemCodeableConcept": {
                 "coding": [
                   {
                     "system": "http://snomed.info/sct",
                     "code": "372826007",
                     "display": "Metoprolol (substance)"
                   }
                 ],
                 "text": "Metoprolol"
               },
               "strength": {
                 "numerator": {
                   "value": 50,
                   "unit": "milligram",
                   "system": "http://unitsofmeasure.org",
                   "code": "mg"
                 },
                 "denominator": {
                   "value": 1,
                   "unit": "Tablet (unit of presentation)",
                   "system": "http://snomed.info/sct",
                   "code": "732936001"
                 }
               }
             }
           ]
         }
       ],
```

* *indentifier:* Identifiers associated with this Medication Statement that are defined by business processes and/or used to refer to it when a direct URL reference to the resource itself is not appropriate -fixed Value "*urn:ietf:rfc:3986*".

```json linenums="1"
 "identifier": [
        {
          "system": "urn:ietf:rfc:3986",
          "value": "urn:uuid:d0f885ca-afa6-4e7e-905d-f7698f9607aa"
        }
      ],
```

* *status:* A code representing the status of the use of the medication - fixed Value: "*completed*"; binding: *[Medication Status Codes](http://hl7.org/fhir/R4/valueset-medication-statement-status.html)*.

```json linenums="1"
 "status": "completed",
```

* *subject:* The person who is taking the medication.

```json linenums="1"
 "subject": {
                    "reference": "Patient/69d661eb-e3ed-4e86-b34c-b5e747c13021"
                },
```

* *reasonCode:* A reason for why the medication is taken - binding: *[Condition/Problem/DiagnosisCodes ](http://hl7.org/fhir/R4/valueset-condition-code.html)*.

```json linenums="1"
 "reasonCode": [{
                        "text": "Bluthochdruck/Herz"
                    }
```

* *note:* Provides extra information about the medication statement that is not conveyed by the other attributes.

```json linenums="1"
 "note": [
         {
           "text": "-"
         }
       ],
```

## Dosage

* *text:* Non-structured dosage element (line 3).
* *timing:* when the medication should be taken (line 6 to 16).
* *route:* Indicates the route of administration - binding: *[SNOMEDCTRouteCodes](http://hl7.org/fhir/R4/valueset-route-codes.html)*; *[EDQM - RouteOfAdministration](http://fhir.ch/ig/ch-emed/ValueSet-edqm-routeofadministration.html)* (line 17 to 25).
* *doseAndRate:* The amount of medication administered (line 26 to 36).

Example normal Dosing (incl. Dosage Non-Structured):

[Profile information (normal Dosing)](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-dosage-structured-normal.html)

[Profile information (Dosage Non-Structured)](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-dosage-nonstructured.html)

```json linenums="1"
 "dosage" : [
    {
      "text" : "Morgens und abends je 1 Tablette einnehmen"
    },
    {
      "timing" : {
          "repeat" : {
          "boundsPeriod" : {
              "start" : "2012-02-04"
          },
          "when" : [
              "MORN",
              "EVE"
          ]
        }
      },
      "route" : {
          "coding" : [
          {
              "system" : "urn:oid:0.4.0.127.0.16.1.1.2.1",
              "code" : "20053000",
              "display" : "Oral use"
          }
        ]
      },
      "doseAndRate" : [
          {
          "doseQuantity" : {
              "value" : 1,
              "unit" : "Tablet (unit of presentation)",
              "system" : "http://snomed.info/sct",
              "code" : "732936001"
          }
        }
      ]
    }
  ]
```

* *text:* Non-structured dosage element (line 3).
* *timing:* when the medication should be taken (line 7 to 16).
* *route:* Indicates the route of administration - binding: *[SNOMEDCTRouteCodes](http://hl7.org/fhir/R4/valueset-route-codes.html)*; *[EDQM - RouteOfAdministration](http://fhir.ch/ig/ch-emed/ValueSet-edqm-routeofadministration.html)* (line 17 to 25).
* *doseAndRate:* The amount of medication administered (line 26 to 36).

Example split Dosing (incl. Dosage Non-Structured):

[Profile information (split Dosing)](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-dosage-structured-split.html)

[Profile information (Dosage Non-Structured)](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-dosage-nonstructured.html)
```json linenums="1"
 "dosage": [
          {
            "text": "Morgens 1 und abends 1/2 Tablette nehmen"
          },
          {
            "sequence": 1,
            "timing": {
              "repeat": {
                "boundsPeriod": {
                 "start": "2012-02-04"
               },
               "when": [
                 "MORN"
               ]
             }
           },
           "route": {
             "coding": [
               {
                 "system": "urn:oid:0.4.0.127.0.16.1.1.2.1",
                 "code": "20053000",
                 "display": "Oral use"
               }
             ]
           },
           "doseAndRate": [
             {
               "doseQuantity": {
                 "value": 1,
                 "unit": "Tablet (unit of presentation)",
                 "system": "http://snomed.info/sct",
                 "code": "732936001"
               }
             }
           ]
         },
         {
           "sequence": 2,
           "timing": {
             "repeat": {
               "boundsPeriod": {
                 "start": "2012-02-04"
               },
               "when": [
                 "EVE"
               ]
             }
           },
           "route": {
             "coding": [
               {
                 "system": "urn:oid:0.4.0.127.0.16.1.1.2.1",
                 "code": "20053000",
                 "display": "Oral use"
               }
             ]
           },
           "doseAndRate": [
             {
               "doseQuantity": {
                 "value": 0.5,
                 "unit": "Tablet (unit of presentation)",
                 "system": "http://snomed.info/sct",
                 "code": "732936001"
               }
             }
           ]
         }
       ]
     }
   },
```

The resource "Binary" represents the original representation of the Medication Card document.

```json linenums="1"
 "resource": {
                "resourceType": "Binary",
                "id": "2-7-pdf",
                "language": "de-CH",
                "contentType": "application/pdf",
                "data": "JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGU..."
            }
```

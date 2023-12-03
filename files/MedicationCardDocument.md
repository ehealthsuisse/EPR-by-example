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

```json
  1  {
  2    "resourceType" : "Bundle",
  3    "id" : "2-7-MedicationCard",
  4    "meta" : {
  5      "lastUpdated" : "2020-02-21T12:31:59.738+00:00",
  6      "profile" : [
  7        "http://fhir.ch/ig/ch-emed/StructureDefinition/ch-emed-document-medicationcard"
  8     ]
  9   },
 10   "identifier" : {
 11     "system" : "urn:ietf:rfc:3986",
 12     "value" : "urn:uuid:6b6ed376-a7da-44cb-92d1-e75ce1ae73b0"
 13   },
 14   "type" : "document",
 15   "timestamp" : "2012-02-04T14:05:00+01:00",
 16   "entry" : [
 17     {
 18       "fullUrl" : "http://test.fhir.ch/r4/Composition/2-7-MedicationCard",
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

```json 
  1  "entry" : [
  2    {
  3      "fullUrl" : "http://test.fhir.ch/r4/Composition/2-7-MedicationCard",  
  4      "resource" : {
  5        "resourceType" : "Composition",
  6        "id" : "2-7-MedicationCard",
  7        "language" : "de-CH",
  8        "text" : {
  9          "status" : "extensions",
 10          "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"de-CH\" lang=\"de-CH\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"2-7-MedicationCard\"  (Language \"de-CH\") </p></div><p><b>EPR Information Recipient</b>: <a href=\"#Patient_MonikaWegmuellerRecipient\">See above (Patient/MonikaWegmuellerRecipient)</a></p><p><b>identifier</b>: id: urn:uuid:6b6ed376-a7da-44cb-92d1-e75ce1ae73b0</p><p><b>status</b>: final</p><p><b>type</b>: Medication summary <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://loinc.org/\">LOINC</a>#56445-0; <a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#721912009 \"Medication summary document (record artifact)\")</span></p><p><b>date</b>: 2012-02-04T14:05:00+01:00</p><p><b>author</b>: </p><ul><li><a href=\"#Practitioner_FamilienHausarzt\">See above (Practitioner/FamilienHausarzt)</a></li><li><a href=\"#Organization_Hausarzt\">See above (Organization/Hausarzt)</a></li></ul><p><b>title</b>: Medikationsplan</p><p><b>confidentiality</b>: N</p><p><b>custodian</b>: <a href=\"#Organization_Custodian\">See above (Organization/Custodian)</a></p></div>"
 11         },
 12         "extension" : [
 13           {
 14             "url" : "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-informationrecipient",
 15             "valueReference" : {
 16              "reference" : "Patient/MonikaWegmuellerRecipient"
 17             }
 18           }
 19         ],
 20         "identifier" : {
 21           "system" : "urn:ietf:rfc:3986",
 22           "value" : "urn:uuid:6b6ed376-a7da-44cb-92d1-e75ce1ae73b0"
 23         },
 24         "status" : "final",
 25         "type" : {
 26           "coding" : [
 27             {
 28               "system" : "http://loinc.org",
 29               "code" : "56445-0",
 30               "display" : "Medication summary"
 31             },
 32             {
 33               "system" : "http://snomed.info/sct",
 34               "code" : "721912009",
 35               "display" : "Medication summary document (record artifact)"
 36             }
 37           ]
 38         },
```

* *subject:* Who the composition is about. Its a reference to the resource contained as entry in the bundle (line 39 to 44).
* *date* The date of the composition creation (line 42).
* *author:* Identifies who is responsible for the information in the composition (line 43 to 56).
* *extension:* Extension to EPR Time (line 45 to 50).

```json
 39       "subject": {
 40          "reference": "Patient/MonikaWegmueller"
 41        },
 42        "date": "2012-02-04T14:05:00+01:00",
 43        "author": [
 44          {
 45            "extension": [
 46              {
 47                "url": "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-time",
 48                "valueDateTime": "2012-02-04T13:55:00+01:00"
 49              }
 50            ],
 51            "reference": "Practitioner/FamilienHausarzt"
 52          },
 53          {
 54            "reference": "Organization/Hausarzt"
 55          }
 56        ],
```

* *title:* Human readable label for the composition.

```json
 57        "title": "Medikationsplan",
```

* *confidentiality:* Level of confidentiality of the Composition - binding: *[v3.ConfidentialityClassification (2014-03-26)](http://hl7.org/fhir/R4/v3/ConfidentialityClassification/vs.html)*.
* extension *[EPR Confidentiality Code](http://fhir.ch/ig/ch-core/StructureDefinition-ch-ext-epr-confidentialitycode.html)*

```json
 58        "confidentiality": "N",
 59        "_confidentiality": {
 60          "extension": [
 61            {
 62              "url": "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-confidentialitycode",
 63              "valueCodeableConcept": {
 64                "coding": [
 65                  {
 66                    "system": "http://snomed.info/sct",
 67                    "code": "17621005",
 68                    "display": "Normally accessible"
 69                  }
 70                ]
 71              }
 72            }
 73          ]
 74        },
```

* *custodian:* Organization who is responsible for the document and access.

```json
 75        "custodian": {
 76          "reference": "Organization/Custodian"
 77        },
```

* *section:* The root of the sections that make up the composition.

```json
 78        "section": [
 79          {
 80            "title": "Medikamentenliste",
 81            "code": {
 82              "coding": [
 83                {
 84                  "system": "http://loinc.org",
 85                  "code": "10160-0",
 86                 "display": "History of medication use"
 87                }
 88              ]
 89            },
 90            "entry": [
 91              {
 92                "reference": "MedicationStatement/2-7-MedStatBeloczok"
 93              },
 94              {
 95                "reference": "MedicationStatement/2-7-MedStatNorvasc"
 96              }
 97            ]
 98          },
 99          {
100            "title": "Kommentar",
101            "code": {
102              "coding": [
103                {
104                  "system": "http://loinc.org",
105                  "code": "48767-8",
106                  "display": "Annotation comment"
107                }
108              ]
109            },
110            "text": {
111              "status": "generated",
112              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n              <span id=\"co1\">\n                  Kommentar zu Medication Treatment\n              </span>\n            </div>"
113            }
114          },
115          {
116            "title": "Original Darstellung",
117            "code": {
118              "coding": [
119                {
120                  "system": "http://loinc.org",
121                  "code": "55108-5",
122                  "display": "Clinical presentation"
123                }
124              ]
125            },
126            "text": {
127              "status": "generated",
128              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n              <a href=\"Binary/2-7-pdf\">Representation of the original view</a>\n            </div>"
129            },
130            "entry": [
131              {
132                "reference": "Binary/2-7-pdf"
133              }
134            ]
135          }
136        ]
137      }
138    },
```

## Information about the patient

In the "Patient" resource, the demographic and administrative data of a patient are specified.

[Profile information](http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-patient-epr.html)


```json
  1  "resource": {
  2      "resourceType": "Patient",
  3      "id": "MonikaWegmueller",
  4      "text": {
  5        "status": "generated",
  6        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><p><b>identifier</b>: Medical record number: 11111111</p><p><b>name</b>: Monika Wegmüller </p><p><b>gender</b>: female</p><p><b>birthDate</b>: 1943-05-15</p><p><b>address</b>: Wiesenstr. 12 Zürich 8003 CH </p></div>"
  7      },
  8     "identifier": [
  9        {
 10           "type": {
 11             "coding": [
 12               {
 13                 "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
 14                 "code": "MR"
 15               }
 16             ]
 17           },
 18           "system": "urn:oid:2.999",
 19           "value": "11111111"
 20         }
 21       ],
 22       "name": [
 23         {
 24           "family": "Wegmüller",
 25           "given": [
 26             "Monika"
 27           ]
 28         }
 29       ],
 30       "gender": "female",
 31       "birthDate": "1943-05-15",
 32       "address": [
 33         {
 34           "line": [
 35             "Wiesenstr. 12"
 36           ],
 37           "city": "Zürich",
 38           "postalCode": "8003",
 39           "country": "CH"
 40         }
 41       ]
 42     }
 43   },
```

## Information about the practitioner

The resource Practitioner indicates which practitioner has prescribed a medication.

[Profile information](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-practitionerrole.html)

```json
  1 "resource" : {
  2      "resourceType" : "Practitioner",
  3      "id" : "FamilienHausarzt",
  4      "text" : {
  5        "status" : "generated",
  6        "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"FamilienHausarzt\" </p></div><p><b>identifier</b>: id: 7601000234438</p><p><b>name</b>: Familien Hausarzt </p><p><b>address</b>: Krankenstrasse 2 Zürich 8005 CH </p></div>"
  7      },
  8      "identifier" : [
  9        {
 10           "system" : "urn:oid:2.51.1.3",
 11           "value" : "7601000234438"
 12         }
 13       ],
 14       "name" : [
 15         {
 16           "family" : "Hausarzt",
 17           "given" : [
 18             "Familien"
 19           ]
 20         }
 21       ],
 22       "address" : [
 23         {
 24           "line" : [
 25             "Krankenstrasse 2"
 26           ],
 27           "city" : "Zürich",
 28           "postalCode" : "8005",
 29           "country" : "CH"
 30         }
 31       ]
 32     }
```

## Information about the organization

The resource stores the information about the organization that create the Medication Card document.

[Profile information](http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-organization-epr.html)

```json
  1 "resource" : {
  2      "resourceType" : "Organization",
  3      "id" : "Hausarzt",
  4      "text" : {
  5        "status" : "generated",
  6        "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"Hausarzt\" </p></div><p><b>identifier</b>: id: 7601000234438</p><p><b>name</b>: Hausarzt</p><p><b>address</b>: Krankenstrasse 2 Zürich 8005 CH </p></div>"
  7      },
  8      "identifier" : [
  9        {
 10           "system" : "urn:oid:2.51.1.3",
 11           "value" : "7601000234438"
 12         }
 13       ],
 14       "name" : "Hausarzt",
 15       "address" : [
 16         {
 17           "line" : [
 18             "Krankenstrasse 2"
 19           ],
 20           "city" : "Zürich",
 21           "postalCode" : "8005",
 22           "country" : "CH"
 23         }
 24       ]
 25     }
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

```json
  1 "resourceType": "MedicationStatement",
  2        "id": "2-7-MedStatBeloczok",
  3        "text": {
  4          "status": "extensions",
  5          "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><blockquote><p><b>CH EMED Extension Treatment Plan</b></p><h3>Urls</h3><table class=\"grid\"><tr><td>-</td></tr><tr><td>*</td></tr></table><p><b>value</b>: id: urn:uuid:5712fffe-20c6-11e6-b67b-9e71128cae77</p><h3>Urls</h3><table class=\"grid\"><tr><td>-</td></tr><tr><td>*</td></tr></table><p><b>value</b>: id: urn:uuid:5712fffe-20c6-11e6-b67b-9e71128cae77</p></blockquote><p><b>identifier</b>: id: urn:uuid:d0f885ca-afa6-4e7e-905d-f7698f9607aa</p><p><b>status</b>: completed</p><p><b>medication</b>: <a name=\"med\"> </a></p><blockquote><p><b>code</b>: <span title=\"Codes: {urn:oid:2.51.1.1 7680521101306}\">BELOC ZOK Ret Tabl 50 mg</span></p><p><b>form</b>: <span title=\"Codes: {urn:oid:0.4.0.127.0.16.1.1.2.1 10219000}\">Tablet</span></p><p><b>amount</b>: 30 Tablet (unit of presentation)/1 Package</p><h3>Ingredients</h3><table class=\"grid\"><tr><td>-</td><td><b>Item[x]</b></td><td><b>Strength</b></td></tr><tr><td>*</td><td><span title=\"Codes: {http://snomed.info/sct 372826007}\">Metoprolol</span></td><td>50 milligram/1 Tablet (unit of presentation)</td></tr></table></blockquote><p><b>subject</b>: <a href=\"#Patient_MonikaWegmueller\">See above (Patient/MonikaWegmueller)</a></p><p><b>reasonCode</b>: <span title=\"Codes: \">Bluthochdruck</span></p><p><b>note</b>: -</p><h3>Dosages</h3><table class=\"grid\"><tr><td>-</td></tr><tr><td>*</td></tr><tr><td>*</td></tr><tr><td>*</td></tr></table></div>"
  6        },
  7        "contained": [
  8          {
  9            "resourceType": "Medication",
 10            "id": "med",
 11            "code": {
 12              "coding": [
 13                {
 14                  "system": "urn:oid:2.51.1.1",
 15                  "code": "7680521101306",
 16                "display": "BELOC ZOK Ret Tabl 50 mg 30 Stk"
 17              }
 18            ],
 19            "text": "BELOC ZOK Ret Tabl 50 mg"
 20          },
 21          "form": {
 22            "coding": [
 23              {
 24                "system": "urn:oid:0.4.0.127.0.16.1.1.2.1",
 25                "code": "10219000",
 26                "display": "Tablet"
 27              }
 28            ]
 29          },
 30          "amount": {
 31            "numerator": {
 32              "value": 30,
 33              "unit": "Tablet (unit of presentation)",
 34              "system": "http://snomed.info/sct",
 35              "code": "732936001"
 36            },
 37            "denominator": {
 38              "value": 1,
 39              "unit": "Package",
 40              "system": "http://unitsofmeasure.org",
 41              "code": "{Package}"
 42              }
 43            },
 44            "ingredient": [
 45              {
 46                "itemCodeableConcept": {
 47                  "coding": [
 48                    {
 49                      "system": "http://snomed.info/sct",
 50                      "code": "372826007",
 51                      "display": "Metoprolol (substance)"
 52                    }
 53                  ],
 54                  "text": "Metoprolol"
 55                },
 56                "strength": {
 57                  "numerator": {
 58                    "value": 50,
 59                    "unit": "milligram",
 60                    "system": "http://unitsofmeasure.org",
 61                    "code": "mg"
 62                  },
 63                  "denominator": {
 64                    "value": 1,
 65                    "unit": "Tablet (unit of presentation)",
 66                    "system": "http://snomed.info/sct",
 67                    "code": "732936001"
 68                  }
 69                }
 70              }
 71            ]
 72          }
 73        ],
```

* *indentifier:* Identifiers associated with this Medication Statement that are defined by business processes and/or used to refer to it when a direct URL reference to the resource itself is not appropriate -fixed Value "*urn:ietf:rfc:3986*".

```json
  1 "identifier": [
  2        {
  3          "system": "urn:ietf:rfc:3986",
  4          "value": "urn:uuid:d0f885ca-afa6-4e7e-905d-f7698f9607aa"
  5        }
  6      ],
```

* *status:* A code representing the status of the use of the medication - fixed Value: "*completed*"; binding: *[Medication Status Codes](http://hl7.org/fhir/R4/valueset-medication-statement-status.html)*.

```json
  1 "status": "completed",
```

* *subject:* The person who is taking the medication.

```json
  1 "subject": {
  2                    "reference": "Patient/69d661eb-e3ed-4e86-b34c-b5e747c13021"
  3                },
```

* *reasonCode:* A reason for why the medication is taken - binding: *[Condition/Problem/DiagnosisCodes ](http://hl7.org/fhir/R4/valueset-condition-code.html)*.

```json
  1 "reasonCode": [{
  2                        "text": "Bluthochdruck/Herz"
  3                    }
```

* *note:* Provides extra information about the medication statement that is not conveyed by the other attributes.

```json
  1 "note": [
  2         {
  3           "text": "-"
  4         }
  5       ],
```

## Dosage

* *text:* Non-structured dosage element (line 3).
* *timing:* when the medication should be taken (line 6 to 16).
* *route:* Indicates the route of administration - binding: *[SNOMEDCTRouteCodes](http://hl7.org/fhir/R4/valueset-route-codes.html)*; *[EDQM - RouteOfAdministration](http://fhir.ch/ig/ch-emed/ValueSet-edqm-routeofadministration.html)* (line 17 to 25).
* *doseAndRate:* The amount of medication administered (line 26 to 36).

Example normal Dosing (incl. Dosage Non-Structured):

[Profile information (normal Dosing)](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-dosage-structured-normal.html)

[Profile information (Dosage Non-Structured)](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-dosage-nonstructured.html)

```json
  1 "dosage" : [
  2    {
  3      "text" : "Morgens und abends je 1 Tablette einnehmen"
  4    },
  5    {
  6      "timing" : {
  7          "repeat" : {
  8          "boundsPeriod" : {
  9              "start" : "2012-02-04"
 10           },
 11           "when" : [
 12               "MORN",
 13               "EVE"
 14           ]
 15         }
 16       },
 17       "route" : {
 18           "coding" : [
 19           {
 20               "system" : "urn:oid:0.4.0.127.0.16.1.1.2.1",
 21               "code" : "20053000",
 22               "display" : "Oral use"
 23           }
 24         ]
 25       },
 26       "doseAndRate" : [
 27           {
 28           "doseQuantity" : {
 29               "value" : 1,
 30               "unit" : "Tablet (unit of presentation)",
 31               "system" : "http://snomed.info/sct",
 32               "code" : "732936001"
 33           }
 34         }
 35       ]
 36     }
 37   ]
```

* *text:* Non-structured dosage element (line 3).
* *timing:* when the medication should be taken (line 7 to 16).
* *route:* Indicates the route of administration - binding: *[SNOMEDCTRouteCodes](http://hl7.org/fhir/R4/valueset-route-codes.html)*; *[EDQM - RouteOfAdministration](http://fhir.ch/ig/ch-emed/ValueSet-edqm-routeofadministration.html)* (line 17 to 25).
* *doseAndRate:* The amount of medication administered (line 26 to 36).

Example split Dosing (incl. Dosage Non-Structured):

[Profile information (split Dosing)](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-dosage-structured-split.html)

[Profile information (Dosage Non-Structured)](http://build.fhir.org/ig/hl7ch/ch-emed/StructureDefinition-ch-emed-dosage-nonstructured.html)
```json
  1 "dosage": [
  2          {
  3            "text": "Morgens 1 und abends 1/2 Tablette nehmen"
  4          },
  5          {
  6            "sequence": 1,
  7            "timing": {
  8              "repeat": {
  9                "boundsPeriod": {
 10                  "start": "2012-02-04"
 11                },
 12                "when": [
 13                  "MORN"
 14                ]
 15              }
 16            },
 17            "route": {
 18              "coding": [
 19                {
 20                  "system": "urn:oid:0.4.0.127.0.16.1.1.2.1",
 21                  "code": "20053000",
 22                  "display": "Oral use"
 23                }
 24              ]
 25            },
 26            "doseAndRate": [
 27              {
 28                "doseQuantity": {
 29                  "value": 1,
 30                  "unit": "Tablet (unit of presentation)",
 31                  "system": "http://snomed.info/sct",
 32                  "code": "732936001"
 33                }
 34              }
 35            ]
 36          },
 37          {
 38            "sequence": 2,
 39            "timing": {
 40              "repeat": {
 41                "boundsPeriod": {
 42                  "start": "2012-02-04"
 43                },
 44                "when": [
 45                  "EVE"
 46                ]
 47              }
 48            },
 49            "route": {
 50              "coding": [
 51                {
 52                  "system": "urn:oid:0.4.0.127.0.16.1.1.2.1",
 53                  "code": "20053000",
 54                  "display": "Oral use"
 55                }
 56              ]
 57            },
 58            "doseAndRate": [
 59              {
 60                "doseQuantity": {
 61                  "value": 0.5,
 62                  "unit": "Tablet (unit of presentation)",
 63                  "system": "http://snomed.info/sct",
 64                  "code": "732936001"
 65                }
 66              }
 67            ]
 68          }
 69        ]
 70      }
 71    },
```

The resource "Binary" represents the original representation of the Medication Card document.

```json
  1 "resource": {
  2                "resourceType": "Binary",
  3                "id": "2-7-pdf",
  4                "language": "de-CH",
  5                "contentType": "application/pdf",
  6                "data": "JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGU..."
  7            }
```

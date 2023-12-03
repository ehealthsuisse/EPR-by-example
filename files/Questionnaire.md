# How to build a FHIR-Questionnaire

This guide aims to explain how to build a FHIR Questionnaire, and in particular how to use the extensions necessary to make full use of the `@i4mi/fhir-questionnaire-renderer` library. You can use the [Questionnaire Prototype](https://github.com/mHealth-Prototyp/Questionnaire) from the [mHealth prototype project](https://github.com/mHealth-Prototyp) to render the questionnaire.

## Useful Links

- [FHIR Resource Questionnaire](https://hl7.org/fhir/r4b/questionnaire.html): Official documentation for FHIR Questionnaire
- [@i4mi/fhir-questionnaire-renderer](https://www.npmjs.com/package/@i4mi/fhir-questionnaire-renderer): Library for rendering a `Questionnaire` resource in Quasar
- [@i4mi/fhir_questionnaire](https://www.npmjs.com/package/@i4mi/fhir_questionnaire): Library for managing the logic of FHIR Questionnaires, with updating depending questions, generation of `QuestionnaireResponse` resources, prepopulation and more.
- [LHC FHIR Questionnaire Builder](https://lhcformbuilder.nlm.nih.gov/): Tool to build basic FHIR Questionnaire.
- [FHIR Validator](https://validator.fhir.org): Useful tool to check if your Questionnaire is a valid FHIR resource.

## Minimal Example

Your are free to set whatever fields you want inside your `Questionnaire` resource (note that the `status` field is mandatory), however only the following fields will be rendered by the Questionnaire Renderer:

- `title` the title of the questionnaire
- `description` the description as a markdown string
- `item` the array that contains the questions

```json
{
  "resourceType": "Questionnaire",
  "status": "draft",
  "title": "Basic Data Questionnaire",
  "description": "# How it works?\n\n Simply enter your date of birth and your name and press save!",
  "item": [
    {
      "linkId": "Q1",
      "type": "dateTime",
      "required": true,
      "text": "Date of Birth"
    },
    {
      "linkId": "Q2",
      "type": "boolean",
      "required": true,
      "text": "Vaccinated against polio"
    }
  ]
}
```

For a more detailed and commented example, see the last chapter of this guide.

## Adding a question

To add a question, add an object inside the `item` array. Every question should have a unique `linkId` and a `type`. The rendering library supports the following subset of the [questionnaire item types](https://www.hl7.org/fhir/valueset-item-type.html):

- `group`
- `display`
- `boolean`
- `decimal`
- `integer`
- `date`
- `datetime`
- `time`
- `string`
- `text`
- `url`

### Required questions

To specify if a questionnaire item is required to be answered, set the field `required` to `true`.

For details, please see [the official documentation for enableWhen](https://hl7.org/fhir/r4b/questionnaire-definitions.html#Questionnaire.item.enableWhen).

### Answer options for choice questions

For choice questions, you can specify the potential answer options in the answerOptions field. Usually, it makes the most sense to use the valueCoding type here, but in this documentation we chose valueString for keeping it simpler.

```json
{
  "linkId": "Q4",
  "type": "choice",
  "text": "Eye color",
  "repeats": false,
  "answerOptions": [
    {
      "valueString": "green"
    },
    {
      "valueString": "brown"
    },
    {
      "valueString": "blue"
    },
    {
      "valueString": "other"
    }
  ]
}
```

The `repeats` field declares if a choice question can have multiple answers or not. Set it to `true` to have a multiple choice question.

As an alternative to `answerOptions`, you can link to a ValueSet in the `answerValueSet` field with an `#` and the id of the contained value-set. The valueSet resource must be in the `contained` of the Questionnaire, external ValueSets are not supported as of now.

```json
{
  ...,
  "answerValueSet": "#ORGAN-DONATION-LIST-ValueSet"
}
```

### Subquestions

In a FHIR questionnaire, it is possible to have subquestions for a question. Just add the subquestion in the `item` field of the parent question. Of course, a parent item can have multiple subquestions, and the subquestions themselves can have subquestions again. This is rendered in a hierarchical way by the questionnaire renderer. If you want to display the subquestions depending from the answer given to the parent question, you have to declare them as depending questions (see next chapter).

```json
{
  "linkId": "parent",
  "type": "boolean",
  "text": "Do you have children?",
  "item": [
    {
      "linkId": "subQuestion",
      "type": "integer",
      "text": "How many children do you have?"
    }
  ]
}
```

### Depending questions

You can also dynamically enable or not some questions, depending on the status of other questions.

```json
{
  "linkId": "Q3",
  "type": "date",
  "text": "Date of vaccination",
  "enableWhen": [
    {
      "question": "Q2",
      "operator": "=",
      "answerBoolean": true
    }
  ]
}
```

### Initial values

You can also define an initial answer, that is preset to a question and can be changed by the user.

```json
{
  "linkId": "initial",
  "type": "boolean",
  "text": "Do you want to receive our amazing newsletter?",
  "initial": [
    {
      "valueBoolean": true
    }
  ]
}
```

## Questionnaire Item UI Control Codes

It is possible to specify how questions should be rendered by adding an [extension](http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl) to an element or to its child (see next chapters for more information).

Currently only the `Help-Button`, `Prompt` and `Unit` codes are supported. To see which items do support these codes, please refer on [documentation of fhir-questionnaire-renderer](https://www.npmjs.com/package/@i4mi/fhir-questionnaire-renderer).

For `choice` questions you can specify if the question should be rendered with radio control (one answer) or with checkboxes (multiple answer allowed) by adding an [extension](http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl) directly to the question. If you do not use this extension on `choice` questions, they will be rendered as dropdown control and the `repeats` will be used to determine if it is or not a multiple answers question.

### Help Button

If you want to add explanatory/help text to a question, you can do so by adding an item with `display` element with the `help` [code](http://hl7.org/fhir/questionnaire-item-control) and `questionnaire-itemControl` [extension](http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl) as described below.

The help element will take the form of an icon with a question mark which will display the text when hovering over it on a computer or pressing it on a mobile device.

```json
{
  "linkId": "Q1-with-help",
  "text": "Where did you put your advanced directives?",
  "type": "text",
  "item": [
    {
      "extension": [
        {
          "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "http://hl7.org/fhir/questionnaire-item-control",
                "code": "help",
                "display": "Help-Button"
              }
            ],
            "text": "Help-Button"
          }
        }
      ],
      "linkId": "H-Q1",
      "text": "Please, be precise e.g ”In the middle drawer of my desk at my house.”",
      "type": "display"
    }
  ]
}
```

### Prompt

If you want to add prompt/placeholder to an input question, you can do so by adding an item with `display` element with the `prompt` [code](http://hl7.org/fhir/questionnaire-item-control) and `questionnaire-itemControl` [extension](http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl) as described below.

The prompt element will take the form of a text inside an input to give information about what should be entered.

```json
{
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/questionnaire-item-control",
            "code": "prompt",
            "display": "Prompt"
          }
        ],
        "text": "Prompt"
      }
    }
  ],
  "linkId": "P-Q1",
  "text": "Your advanced directive is ...",
  "type": "display"
}
```

### Unit

If you want to add unit to an input question, you can do so by adding an item with `display` element with the `unit` [code](http://hl7.org/fhir/questionnaire-item-control) and `questionnaire-itemControl` [extension](http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl) as described below.

The unit element will be displayed at the end of the input field as an indication of the unit of what the user should enter. Please not that the unit is only cosmetic, if you want to have an answer corresponding to an input with its unit, you should use a quantity item, but its not supported by this project.

```json
{
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/questionnaire-item-control",
            "code": "unit",
            "display": "Unit"
          }
        ],
        "text": "Unit"
      }
    }
  ],
  "linkId": "U-Q1",
  "text": "m / s ^ 2",
  "type": "display"
}
```

### Check-box

If you want to render `choice` question with checkbox control, you can do so by adding the `check-box` [code](http://hl7.org/fhir/questionnaire-item-control) and `questionnaire-itemControl` [extension](http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl) as described below.

```json
{
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/questionnaire-item-control",
            "code": "check-box",
            "display": "Check-box"
          }
        ],
        "text": "Check-box"
      }
    }
  ],
  "linkId": "Q1-",
  "type": "choice",
  "required": true,
  "repeats": true,
  "text": "I CONSENT to the removal of the following organs, tissues or cells, and to the associated preparatory medical measures:",
  "answerValueSet": "#ORGAN-DONATION-LIST-ValueSet"
}
```

### Radio Button

If you want to render `choice` question with radio control, you can do so by adding the `radio-button` [code](http://hl7.org/fhir/questionnaire-item-control) and `questionnaire-itemControl` [extension](http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl) as described below.

```json
{
      "extension": [
        {
          "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "http://hl7.org/fhir/questionnaire-item-control",
                "code": "radio-button",
                "display": "Radio Button"
              }
            ],
            "text": "Radio Button"
          }
        }
      ],
      "linkId": "Q1",
      "text": "In the event that removal of organs, tissues or cells is possible after my death, my wishes are as follows:",
      "type": "choice",
      "required": true,
      "repeats": false,
      "answerValueSet": "#ORGAN-DONATION-RESPONSE-ValueSet",
```

## Internationalisation

To add internationalisation to a questionnaire, use the FHIR extension [translation](http://hl7.org/fhir/StructureDefinition/translation). The following is applicable for most text elements of a questionnaire (`text`, `title`, `description`, ...).
Please note, that for choice questions with answerOptions, internationalisation is not supported. In this case, you need to use an [answerValueSet with designation](https://www.hl7.org/fhir/valueset-definitions.html#ValueSet.compose.include.concept.designation).

```json
  "title": "Digital Organ Donation Card",
  "_title": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "de"
          },
          {
            "url": "content",
            "valueString": "Digitale Organspende-Karte"
          }
        ]
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "fr"
          },
          {
            "url": "content",
            "valueString": "Carte numérique de don d'organes"
          }
        ]
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "it"
          },
          {
            "url": "content",
            "valueString": "Carta digitale per la donazione di organi"
          }
        ]
      }
    ]
  }
```

The `@i4mi/fhir_questionnaire` library will process the extension, see the [documentation](https://www.npmjs.com/package/@i4mi/fhir_questionnaire) for more information.

## Prepopulation

Besides the initial value (see above), it is also possible to prepopulate the answers to the questions, using another FHIR resource with the information contained. The difference between initial values and prepopulation is that, with initial values, the preset answers are the same for every user, while with prepopulation, the answers can be set dynamically for every user, depending on the resource that is passed to the Questionnaire library. How the information is to be extracted from the passed resource is described in [FHIRPath](https://hl7.org/fhirpath/).

For this, you have to have the initialExpression extension in every item that should be prepopulated, with the FHIRPath expression that extracts the wanted value from the passed resource.

```json
{
  "linkId": "populateExample",
  "text": "Birthdate",
  "type": "date",
  "extension": [
    {
      "url": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression",
      "valueExpression": {
        "language": "text/fhirpath",
        "expression": "%patient.birthDate"
      }
    }
  ]
}
```

Of course, you also have to pass the resource containing the information to the QuestionnaireData library. You can do this like this:

```typescript
const fhirQuestionnaire = new QuestionnaireData(myQuestionnaire, languages); // fhirQuestionnaire is the instance of your QuestionnaireData
fhirQuestionnaire.populate(
  [myPatientResource], // the resources containing the needed information; you can only provide one resource of every ResourceType (e.g. Patient)
  true // true if you want to overwrite potentially already existing answers
);
```

More information on prepopulating are found on the [@i4mi/fhir-questionnaire README](https://github.com/i4mi/fhir-questionnaire).

## Detailed example with comments

This is a detailled example using many of the concepts explained above. It is based on the organ donation questionnaire used in this app, however some redundancies are stripped out for better readability.

```json
{
  "resourceType": "Questionnaire",
  "url": "https://github.com/mHealth-Prototyp/Questionnaires/blob/main/resources/Questionnaire/organ-donation.json",
  "version": "0.0.1", // the questionnaire needs a version number so the QuestionnaireResponse resource can be matched with the exact version of the questionnaire
  "name": "OrganDonation", // the technical name of the questionnaire, which is usually not displayed to the user
  "title": "Digital Organ Donation Card", // the title of the questionnaire as it is displayed to the user
  "_title": {
    "extension": [
      {
        // for every language translation of the title, we need an extension of the title field, which are placed in the "_title" field
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "de"
          },
          {
            "url": "content",
            "valueString": "Digitale Organspende-Karte"
          }
        ]
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "fr"
          },
          {
            "url": "content",
            "valueString": "Carte numérique de don d'organes"
          }
        ]
      }
    ]
  },
  "status": "draft", // the status of the questionnaire
  "date": "2023-03-20", // when the questionnaire was published
  "description": "**Here's how it works**  \n1. Fill in the online form completely.  \n2. Register it in your EPR.  \n3. Inform your relatives of your wishes and inform them of the presence of this form on your EPD. If you change your mind, fill in the form again, and inform your relatives of this new decision.",
  "_description": {
    "extension": [
      // internationalisation for the description works the same as for the title and is stripped out for better readability
    ]
  },
  "code": [
    // this code represents the whole questionnaire
    {
      "system": "urn:prototype-4-codes", // in lack of a better alternative, we use an own code system
      "code": "organ-donation",
      "display": "Organ Donation"
    }
  ],
  "item": [
    {
      "linkId": "Dgroup", // a question group is also a question...
      "type": "group", // ... of type group
      "item": [
        // the actual subquestions of the group are in the "item" field
        {
          "linkId": "D1", // the unique ID of the question
          "text": "First and familiy name", // text displayed for the question
          "_text": {
            "extension": [
              // internationalisation for the item texts works the same as for the title and is stripped out for better readability
            ]
          },
          "type": "string", // the name of the user is a string
          "required": "true", // this question is mandatory
          "repeats": false, // but only one answer is allowed
          "readOnly": true, // because we populate it from the Patient resource, in this case the name is read only
          "extension": [
            {
              // with this extension, we can define with a FHIRPath expression, how the value of the question should be prepopulated
              "url": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression",
              "valueExpression": {
                "language": "text/fhirpath",
                "expression": "%patient.name.given.first() + ' ' + %patient.name.family.first()"
              }
            }
          ]
        },
        {
          "linkId": "D2",
          "text": "Birthdate",
          "_text": {
            "extension": [
              // internationalisation for the item texts works the same as for the title and is stripped out for better readability
            ]
          },
          "type": "date", // type of birth date is a date
          "required": "true", // this question is mandatory
          "repeats": false, // but only one answer is allowed
          "readOnly": true, // because we populate it from the Patient resource, in this case the name is read only
          "extension": [
            {
              // another example how to prepopulate the answer with the birthdate from the patient resource
              "url": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression",
              "valueExpression": {
                "language": "text/fhirpath",
                "expression": "%patient.birthDate"
              }
            }
          ]
        }
      ]
    },
    {
      "linkId": "Q1",
      "text": "In the event that removal of organs, tissues or cells is possible after my death, my wishes are as follows:",
      "_text": {
        "extension": [
          // internationalisation for the item texts works the same as for the title and is stripped out for better readability
        ]
      },
      "type": "choice", // this is a choice question
      "required": true, // that is also required
      "repeats": false, // but only one answer can be selected
      "answerValueSet": "#ORGAN-DONATION-RESPONSE-ValueSet", // this refers to the answerValueset, where the answers options are defined
      // the valueSet can be found in the "contained" field of the Questionnaire resource
      "item": [
        // the choice question has some sub-questions
        {
          "linkId": "Q1-SQ1",
          "type": "choice",
          "required": true,
          "repeats": true, // other than the parent question, multiple answers are allowed here
          "text": "I CONSENT to the removal of the following organs, tissues or cells, and to the associated preparatory medical measures:",
          "_text": {
            "extension": [
              // internationalisation for the item texts works the same as for the title and is stripped out for better readability
            ]
          },
          "enableWhen": [
            {
              // here we can define when the question should be enabled and thus displayed to the user
              "question": "Q1", // this declares on which question this question depends
              "operator": "=", // we want to enable it when the answer to Q1 equals the following answer (could also be not equal, or bigger / smaller for numeric answers)
              "answerCoding": {
                // and here we define the answer that must be set in Q1 to enable this question
                "system": "https://github.com/mHealth-Prototyp/Questionnaires/blob/main/resources/ValueSet/organ-donation-response.json",
                "code": "yes_following"
              }
            }
          ],
          "answerValueSet": "#ORGAN-DONATION-LIST-ValueSet" // this refers to the answerValueset, where the answers options are defined
          // the valueSet can be found in the "contained" field of the Questionnaire resource
        }
      ],
      "extension": [
        {
          // this itemControl extensions defines that the answer options should be displayed as radio buttons
          "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "http://hl7.org/fhir/questionnaire-item-control",
                "code": "radio-button",
                "display": "Radio Button"
              }
            ],
            "text": "Radio Button"
          }
        }
      ]
    },
    {
      "linkId": "I1",
      "text": "The information you provide here is only recorded on your EPR.",
      "type": "display", // the final question is only for displaying the information, and does not take any answers
      "_text": {
        "extension": [
          // internationalisation for the item texts works the same as for the title and is stripped out for better readability
        ]
      }
    }
  ]
}
```

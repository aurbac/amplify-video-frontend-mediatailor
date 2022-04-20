
## Creating the Frontend application with Amplify

In this section, we describe the steps that we need to follow to create the frontend services using the Amplify tools and services to build the React application.


## Prerequisites

* Obtain an [AWS Account](http://aws.amazon.com/).
* Work in your local or [AWS Cloud9](https://aws.amazon.com/cloud9/) environment with the following tools configured:
  * [AWS CLI configured with IAM Credentials with administrator access](https://docs.aws.amazon.com/cli/latest/reference/configure/).
  * [Install the Amplify CLI](https://docs.amplify.aws/cli/start/install).
  * [Install the CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install).


1. **Create and initialize Amplify project**

Create react application and install dependencies.

``` bash
npx create-react-app amplify-video-frontend-mediatailor
cd amplify-video-frontend-mediatailor
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm i @aws-amplify/ui-react aws-amplify video.js
```

``` bash
amplify init
```


* Enter a name for the project **amplifyvideofrontend**
* Project information
  * Name: amplifyvideofrontend
  * Environment: dev
  * Default editor: Visual Studio Code
  * App type: javascript
  * Javascript framework: react
  * Source Directory Path: src
  * Distribution Directory Path: build
  * Build Command: npm run-script build
  * Start Command: npm run-script start
* Initialize the project with the above configuration? (Y/n) **Yes**
* Using default provider **awscloudformation**
* Do you want to use an AWS profile? **Yes**
* Please choose the profile you want to use **default** (Choose your profile with IAM credentials)


2. **Add Authentication**

Add Authentication with Amazon Cognito as the main authentication provider. Use the default configuration as follow.

``` bash
amplify add auth
```

* Do you want to use the default authentication and security configuration? **Default configuration**
* How do you want users to be able to sign in? **Username**
* Do you want to configure advanced settings? **No, I am done.**

To deploy the services, execute the following command.

``` bash
amplify push
```

* Are you sure you want to continue? Yes

3. **Add API (GraphQL)**

Add an AppSync GraphQL API with Cognito User Pool for the API Authentication.

``` bash
amplify add api
```

* ? Select from one of the below mentioned services: **GraphQL**
* ? Here is the GraphQL API that we will create. Select a setting to edit or continue **Continue**
* ? Choose a schema template: **Single object with fields (e.g., “Todo” with ID, name, description)**
* Do you want to edit the schema now? **No**

Edit the schema by opening the new amplify/backend/api/schema.graphql file in your editor, replace with the following schema.

```
# This "input" configures a global authorization rule to enable public access to
# all models in this schema. Learn more about authorization rules here: https://docs.amplify.aws/cli/graphql/authorization-rules
input AMPLIFY { globalAuthRule: AuthRule = { allow: public } } # FOR TESTING ONLY!

type Message @model(subscriptions: null)
{
  id: ID!
  channel: String! @index(name: "messagesByDate", queryField: "messagesByDate", sortKeyFields: ["createdAt"])
  username: String!
  content: String!
  createdAt: String!
}

type Subscription {
  onCreateMessage: Message @aws_subscribe(mutations: ["createMessage"])
}
```

Once you are happy with your schema, save the file and deploy your new API.

``` bash
amplify push
```

* Are you sure you want to continue? **Yes**
* Do you want to generate code for your newly created GraphQL API **Yes**
* Choose the code generation language target **javascript**
* Enter the file name pattern of graphql queries, mutations and subscriptions **src/graphql//*.js**
* Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions **Yes**
* Enter maximum statement depth [increase from default if your schema is deeply nested] **2**

4. **Create/Replace React application files**

Update the following files in your React application.

* src/App.js
* public/index.html

Create the following files in your React application.

* src/components/VideoPlayer.js
* src/components/VideoChat.js

5. **Add dynamodb table with Amplify Storage**

``` bash
amplify add storage
```

* ✔ Provide a friendly name · **tables**
* ✔ Provide table name · **collection**

You can now add columns to the table.

* ✔ What would you like to name this column · **channel**
* ✔ Choose the data type · **string**
* ✔ Would you like to add another column? (Y/n) · **yes**
* ✔ What would you like to name this column · **keyword**
* ✔ Choose the data type · **string**
* ✔ Would you like to add another column? (Y/n) · **no**

Before you create the database, you must specify how items in your table are uniquely organized. You do this by specifying a primary key. The primary key uniquely identifies each item in the table so that no two items can have the same key. This can be an individual column, or a combination that includes a primary key and a sort key.

To learn more about primary keys, see:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey

* ✔ Choose partition key for the table · **channel**
* ✔ Do you want to add a sort key to your table? (Y/n) · **yes**
Only one option for [Choose sort key for the table]. Selecting [keyword].

You can optionally add global secondary indexes for this table. These are useful when you run queries defined in a different column than the primary key.
To learn more about indexes, see:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.SecondaryIndexes

* ✔ Do you want to add global secondary indexes to your table? (Y/n) · **yes**
* ✔ Provide the GSI name · **main**
* ✔ Choose partition key for the GSI · **keyword**
* ✔ Do you want to add a sort key to your global secondary index? (Y/n) · **no**
* ✔ Do you want to add more global secondary indexes to your table? (Y/n) · **no**
* ✔ Do you want to add a Lambda Trigger for your Table? (y/N) · **no**


6. **Add the Lambda function triggered after new chat messages**


``` bash
amplify add function
```

* ? Select which capability you want to add: **Lambda function (serverless function)**
* ? Provide an AWS Lambda function name: **triggerMessages**
* ? Choose the runtime that you want to use: **NodeJS**
* ? Choose the function template that you want to use: **Hello World**

Available advanced settings:
- Resource access permissions
- Scheduled recurring invocation
- Lambda layers configuration
- Environment variables configuration
- Secret values configuration

* ? Do you want to configure advanced settings? **Yes**
* ? Do you want to access other resources in this project from your Lambda function? **Yes**
* ? Select the categories you want this function to have access to. **storage**
* ? Storage has 2 resources in this project. Select the one you would like your Lambda to access **tables**
* ? Select the operations you want to permit on tables **read, update**

You can access the following resource attributes as environment variables from your Lambda function
        ENV
        REGION
        STORAGE_TABLES_ARN
        STORAGE_TABLES_NAME
        STORAGE_TABLES_STREAMARN

* ? Do you want to invoke this function on a recurring schedule? **No**
* ? Do you want to enable Lambda layers for this function? **No**
* ? Do you want to configure environment variables for this function? **No**
* ? Do you want to configure secret values this function can access? **No**
* ? Do you want to edit the local lambda function now? **No**

Update the amplify/backend/function/triggerMessages/src/index.js file with the following:

``` javascript
/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TABLES_ARN
	STORAGE_TABLES_NAME
	STORAGE_TABLES_STREAMARN
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION});

var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    
    console.log(`EVENT: ${JSON.stringify(event)}`);
    
    var params = {
      ExpressionAttributeValues: {
        ':channel': 'default'
       },
     KeyConditionExpression: 'channel = :channel',
     TableName: process.env.STORAGE_TABLES_NAME
    };
    
    var result = await docClient.query(params).promise();
    
    const keywords = []
    const idCounter = []
    const kids = []
    
    for (const item of result.Items){
        const tmparr = item.values.split(',')
        keywords.push.apply(keywords, tmparr)
        idCounter[item.keyword] = 0
        
        for( const k of tmparr){
            kids.push({ 'value': item.keyword, 'id': item.keyword })
        }
        
    }
    
    console.log(keywords);
    
    for (const record of event.Records) {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
        
        if (record.eventName=="INSERT"){
            console.log(record.dynamodb.NewImage.content.S);
            
            keywords.forEach(function(word, index) {
                if (record.dynamodb.NewImage.content.S.toLowerCase().includes(word)) {
                    console.log(word)
                    console.log(index)
                    idCounter[kids[index].id] += 1;
                    
                }
            })
            
        }    
    
    }
    
    console.log(idCounter);
    
    for (const [key, value] of Object.entries(idCounter)) {
        var params = {
          TableName: process.env.STORAGE_TABLES_NAME,
          Key: {
            'channel' : 'default',
            'keyword' : key
          },
          AttributeUpdates: {
              'counter' : {
                  Action: 'ADD',
                  Value: value
              }
          }
        };
        const result = await docClient.update(params).promise()
    }
    
    return `Successfully processed ${event.Records.length} records.`

};
```

Update the file amplify/backend/function/triggerMessages/custom-policies.json with the following:


``` json
[
  {
    "Action": ["dynamodb:GetRecords", "dynamodb:GetShardIterator", "dynamodb:DescribeStream", "dynamodb:ListStreams", "kinesis:ListShards"],
    "Resource": ["*"]
  }
]
```

7. **Add the Lambda function that updates the Media services**


``` bash
amplify add function
```

* ? Select which capability you want to add: **Lambda function (serverless function)**
* ? Provide an AWS Lambda function name: **updateMedia**
* ? Choose the runtime that you want to use: **NodeJS**
* ? Choose the function template that you want to use: **Hello World**

Available advanced settings:
- Resource access permissions
- Scheduled recurring invocation
- Lambda layers configuration
- Environment variables configuration
- Secret values configuration

* ? Do you want to configure advanced settings? **Yes**
* ? Do you want to access other resources in this project from your Lambda function? **Yes**
* ? Select the categories you want this function to have access to. **storage**
* ? Storage has 2 resources in this project. Select the one you would like your Lambda to access **tables**
* ? Select the operations you want to permit on tables **read, update**

You can access the following resource attributes as environment variables from your Lambda function
        ENV
        REGION
        STORAGE_TABLES_ARN
        STORAGE_TABLES_NAME
        STORAGE_TABLES_STREAMARN
* ? Do you want to invoke this function on a recurring schedule? **Yes**
* ? At which interval should the function be invoked: **Minutes**
* ? Enter the rate in minutes: **2**
* ? Do you want to enable Lambda layers for this function? **No**
* ? Do you want to configure environment variables for this function? **No**
* ? Do you want to configure secret values this function can access? **No**
* ? Do you want to edit the local lambda function now? **No**

Deploy cloud services.

``` bash
amplify push
```

* ? Are you sure you want to continue? **Yes**

Configure dynamodb tablle trigger using the "triggerMessages" function.


8. **Add Hosting**

For this exercise we are going to choose manual deploys allows you to publish your web app to the Amplify Console without connecting a Git provider.

``` bash
amplify add hosting
```

* Select the plugin module to execute **Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)**
* Choose a type **Manual deployment**

Deploy the application by running the following command, it will build the scripts.

``` bash
amplify publish
```

* Are you sure you want to continue? Yes
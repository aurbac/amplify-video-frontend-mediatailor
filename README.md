
## Creating the Frontend application with Amplify

In this section, we describe the steps that we need to follow to create the frontend services using the Amplify tools and services to build the React application.

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

* Please select from one of the below mentioned services: **GraphQL**
* Provide API name: **amplifyvideofrontend**
* Choose the default authorization type for the **API Amazon Cognito User Pool** Use a Cognito user pool configured as a part of this project.
* Do you want to configure advanced settings for the GraphQL API **No, I am done**
* Do you have an annotated GraphQL schema? **No**
* Choose a schema template: **Single object with fields (e.g., “Todo” with ID, name, description)**
* Do you want to edit the schema now? **Yes**

Edit the schema by opening the new schema.graphql file in your editor, replace with the following schema.

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

5. **Add Function**

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

* ? Do you want to configure advanced settings? **No**
* ? Do you want to edit the local lambda function now? **No**

Update the ... .js file... (logic)

Update the file amplify/backend/function/triggerMessages/custom-policies.json with the following:


``` json
[
  {
    "Action": ["dynamodb:GetRecords", "dynamodb:GetShardIterator", "dynamodb:DescribeStream", "dynamodb:ListStreams", "kinesis:ListShards", "comprehend:DetectSentiment"],
    "Resource": ["*"]
  }
]
```

Deploy cloud services.

``` bash
amplify push
```

* ? Are you sure you want to continue? **Yes**

Configure dynamodb tablle trigger using the "triggerMessages" function.


6. **Add Hosting**

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
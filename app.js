/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express   = require('express'),
  app         = express(),
  bodyParser  = require('body-parser'),
  cfenv       = require('cfenv'),
  watson      = require('watson-developer-cloud');

// Set up environment variables
// cfenv provides access to your Cloud Foundry environment
var vcapLocal = null;
try {
  vcapLocal = require("./vcap-local.json");
}
catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {};
var appEnv = cfenv.getAppEnv(appEnvOpts);

// Configure Express
// serve the files out of ./public as our main files
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(__dirname + '/public'));

// Deployment tracker code snippet
//require("cf-deployment-tracker-client").track();

// Start listening for connections
app.listen(appEnv.port, function() {
  console.log("server started at", appEnv.url);
});

var watson_conversation_workspace_id = 'your-conversation-workspace'
var watson_conversation_username = 'your-conversation-username'
var watson_conversation_password = 'your-conversation-password'

var watson_stt_username = 'your-stt-username'
var watson_stt_password = 'your-stt-password'

// Configure Watson Speech to Text service
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

var speechCreds = {
  username: watson_stt_username,
  password: watson_stt_password,
  url: "https://stream.watsonplatform.net/speech-to-text/api"
};

var speech_to_text = new SpeechToTextV1 ({
  username: speechCreds.username,
  password: speechCreds.password,
  version:'v1'
});

var watson = require('watson-developer-cloud');
var authService = new watson.AuthorizationV1({
  username: speechCreds.username,
  password: speechCreds.password,
  url: 'https://stream.watsonplatform.net/authorization/api', // Speech tokens
});

//var authService = watson.authorization(speechCreds);
//Conversation call
var convCreds = {
  version: 'v1',
  version_date: '2018-02-16',
  username: watson_conversation_username,
  password: watson_conversation_password
}
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var conversation = new ConversationV1({
  username: convCreds.username,
  password: convCreds.password,
  version: convCreds.version,
  version_date: convCreds.version_date,
  url: convCreds.url
});

// Root page handler
app.get('/', function(req, res) {
  res.render('index', { ct: req._csrfToken });
});

// Get token using your credentials
app.post('/api/token', function(req, res, next) {
  authService.getToken({url: speechCreds.url}, function(err, token) {
    if (err)
      next(err);
    else
      res.send(token);
  });
});

// Request handler for tone analysis
app.post('/api/classify', function(req, res, next) {
  
  conversation.message({
    workspace_id: watson_conversation_workspace_id,
    input: {'text': req.body.text}
  },  function(err, response) {
    if (err){
      console.log('error:', err);
      return next(err);
    }
    else{
      //console.log(JSON.stringify(response, null, 2));
      return res.json(response);
    }
  });

  /*toneAnalyzer.tone(req.body, function(err, data) {
    if (err)
      return next(err);
    else
      return res.json(data);
  });*/
//  alert('did call conversation');
});

// error-handler settings
require('./config/error-handler')(app);

// Retrieves service credentials for the input service
function getServiceCreds(appEnv, serviceName) {
  var serviceCreds = appEnv.getServiceCreds(serviceName);
  if (!serviceCreds) {
    console.log("service " + serviceName + " not bound to this application");
    return null;
  }
  return serviceCreds;
}

var request = require("request");
var http = require('http');
var https = require('https');
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context,callback) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            console.log("HELLO I AM in initial intentt request")
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == "findDerivativeIntent") 
        {
            console.log("HELLO I AM IN EVENT")
            handleGetInfoIntent(intent, session, callback)
             
        } 
    else 
        {
            throw "Invalid intent"
        }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Do you want to derive a particular expression ? For example, you can ask what is the derivative of x power 2"

    var reprompt = "Do you want to find derivative for some expression?"

    var header = "Derivative"

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

}


function url(num)
{
    return "https://newton.now.sh/derive/x^"+num
}

function getJSON(pn,callback)
{
    console.log("The pn is: "+pn)
    
     request.get(url(pn),function(error,response,body){

         var d = JSON.parse(body)
         
         var result = d.result
         console.log("The result is: "+result)
         if(result.length > 0)
         {
             console.log("The result is: "+result)
             callback(result);
         }
         else
         {
             callback("ERROR");
        }


    })
    

        

}






function handleGetInfoIntent(intent, session, callback) 
{

    console.log("HELLO I AM IN handleGetInfoIntent");
    var speechOutput = "we have an error";
    var powernum = intent.slots.powerNumber.value;
    getJSON(powernum,function(data){
        if(data != "ERROR")
        {
            var speechOutput = data;
        }
        callback(session.attributes,buildSpeechletResponse("Get Info", speechOutput, "Do you want to hear about some facts?", false))

    })
    
    
    
    
    

    
    
    
    
    
    
    

    
    
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}












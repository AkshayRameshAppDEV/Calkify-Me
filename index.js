'use strict'
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
        } else if (event.request.type === "IntentRequest") 
        {
           
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        }
        else if (event.request.type === "SessionEndedRequest") {
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
           
            handlefindDerivativeIntent(intent, session, callback)
             
        }
    else if (intentName == "findDerivativeIntentConstant") 
        {
           
            handlefindDerivativeIntentConstant(intent, session, callback)
             
        }
    
        else if (intentName == "findDerivativeIntentConstantPlusX") 
        {
            
             handlefindDerivativeIntentConstantPlusX(intent, session, callback)
             
        }
     else if (intentName == "findDerivativeIntentConstantXPlus")
    {
        handlefindDerivativeIntentConstantXPlus(intent,session,callback)
    }
    else if (intentName == "findCon")
    {
        handlefindCon(intent,session,callback)
    }
    else if (intentName == "AMAZON.StopIntent")
    {
        callback(session.attributes,buildSpeechletResponse("Derive Me!","GOOD BYE! Come back again by telling Alexa, start Derive Me!", "", true))

    }
    else if (intentName == "AMAZON.HelpIntent")
    {
        getTutorial(callback);
    }
        
    else 
        {
            throw "Invalid Intent"
        }
}

function onSessionEnded(sessionEndedRequest, session) 
{

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome to Derive Me! Do you want to derive a particular expression ? For example, you can ask what is the derivative of x power 2."+
                        " Or go down to the tutorial section by asking can you help me."

    var reprompt = "Do you want to find derivative for some expression?"

    var header = "Derive Me!"

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

}

function getTutorial(callback) {
    var speechOutput = "Welcome to Derive Me tutorials! "+
                        "For now this skill only accept positive numbers and expressions like 7, 5x+7, 9x squared, 7x+12, x cubed."+
                        " To find the derivative of x squared, you can ask what is the derivative of x power 2."+
                        " For constant such as 7, you can ask what is the derivative of 7."+
                        " For 5x squared, you can ask what is the derivative of 5 times x power 2."+
                        " For 3 + x cube, you can ask what is the derivative of 3 plus x power 3."+
                        " For x squared + 6, you can ask what is the derivative of x power 2 plus 6."+
                        " Or you can say stop to stop the skill"

    var reprompt = "Do you want to find derivative for some expression?"

    var header = "Derive Me!"

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

}
//URL's////////////////////////////////////////////////////////////////////
function url(num)
{
    return "https://newton.now.sh/derive/x^"+num
}

function url2(num1,num2)
{
    return "https://newton.now.sh/derive/"+num1+"x^"+num2
}

function url3(num1)
{
    return "https://newton.now.sh/derive/"+num1
}
function url4(num1,num2,num3)
{
    return "https://newton.now.sh/derive/"+num1+"+"+num2+"x^"+num3;
}
function url5(num1,num2,num3)
{
    return "https://newton.now.sh/derive/"+num1+"x^"+num2+"+"+num3;
}
function urlConstant(num1,num2)
{
    return "https://newton.now.sh/derive/"+num1+"x^"+num2
}

//URL's////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getJSON(pn,callback)
{
    console.log("The pn is: "+pn)
    
     request.get(url(pn),function(error,response,body){

         var d = JSON.parse(body)
         
         var result = d.result
         
         if(result.length > 0)
         {
             
             callback(result);
         }
         else
         {
             callback("ERROR");
        }


    })
}


function getJSON2(pn1,pn2,callback)
{
    
    
     request.get(url2(pn1,pn2),function(error,response,body){

         var d = JSON.parse(body)
         
         var result = d.result
         
         if(result.length > 0)
         {
             callback(result)
         }
         


    })
}

function getJSON3(pn,callback)
{
    console.log("The pn is: "+pn)
    
     request.get(url3(pn),function(error,response,body){

         var d = JSON.parse(body)
         
         var result = d.result
         
         if(result.length > 0)
         {
             
             callback(result);
         }
         else
         {
             callback("ERROR");
        }


    })
}

function getJSON4(pn1,pn2,pn3,callback)
{
    
    
     request.get(url4(pn1,pn2,pn3),function(error,response,body){

         var d = JSON.parse(body)
         
         var result = d.result
         
         if(result.length > 0)
         {
             
             callback(result);
         }
         else
         {
             callback("ERROR");
        }


    })
}

function getJSON5(pn1,pn2,pn3,callback)
{
    
    
     request.get(url5(pn1,pn2,pn3),function(error,response,body){

         var d = JSON.parse(body)
         
         var result = d.result
         
         if(result.length > 0)
         {
             
             callback(result);
         }
         else
         {
             callback("ERROR");
        }


    })
}

function getJSONConstant(pn1,pn2,callback)
{
    
    
     request.get(urlConstant(pn1,pn2),function(error,response,body){

         var d = JSON.parse(body)
         
         var result = d.result
         
         if(result.length > 0)
         {
             
             callback(result);
         }
         else
         {
             callback("ERROR");
        }


    })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function  handlefindDerivativeIntent(intent, session, callback) 
{
   
    
    var powernum = intent.slots.powerNumber.value;
    var test;
    if(isNaN(powernum) === false)
    {
        test = true;
    }
    if (powernum !== null && test) 
    {
        getJSON(powernum,function(data){
        if(data != "ERROR")
        {
            var speechOutput = data;
        }
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "The derivative is "+speechOutput,"", true))

         })
        
    }
    else
    {
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "Please tell a number along with invocation","", true))

    }
    
    
}




function handlefindDerivativeIntentConstant(intent, session, callback) 
{

   
    var powernum = intent.slots.powerNumberConstant.value;
    var test;
    if(isNaN(powernum) === false)
    {
        test = true;
    }
    if (powernum !== null && test) 
    {
        getJSON3(powernum,function(data){
        if(data != "ERROR")
        {
            var speechOutput = data;
        }
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "The derivative is "+speechOutput,"", true))

         })
        
    }
    else
    {
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "Please tell a number along with invocation","", true))

    }
    
    
}

function  handlefindDerivativeIntentConstantPlusX(intent, session, callback) 
{

   
    
    var pone = intent.slots.powerNumberConstantPlusXconstant.value;
    var ptwo = intent.slots.powerNumberConstantPlusXnumber.value;
    var pthree = intent.slots.powerNumberConstantPlusXnumberend.value;
    
    var test;
    
    if(isNaN(pone) === false && isNaN(ptwo) === false && isNaN(pthree) === false)
    {
        test = true;
    }
    
    if(pone !== null && ptwo !== null && pthree !== null && test)
    {
       getJSON4(pone,ptwo,pthree,function(data)
        {
        if(data != "ERROR")
        {
            var speechOutput = data;
        }
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "The derivative is "+speechOutput, "", true))

      }) 
    }
    else
    {
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "Please tell a number along with invocation","", true))

    }
    
    
    
}


function   handlefindDerivativeIntentConstantXPlus(intent, session, callback) 
{

     
    var pone = intent.slots.number.value;
    var ptwo = intent.slots.constant.value;
    var pthree = intent.slots.power.value;
    
    var test;
    
    if(isNaN(pone) === false && isNaN(ptwo) === false && isNaN(pthree) === false)
    {
        test = true;
    }
    
    if(pone !== null && ptwo !== null && pthree !== null && test)
    {
        getJSON5(pone,ptwo,pthree,function(data)
    {
        if(data != "ERROR")
        {
            console.log(speechOutput)
            var speechOutput = data;
        }
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "The derivative is "+speechOutput, "", true))

    })
    }
    else
    {
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "Please tell a number along with invocation","", true))

    }
    
    
  
    
    
   
    
}
function  handlefindCon(intent, session, callback) 
{

     
    
    var POT = intent.slots.pot.value;
    var mott = intent.slots.mot.value;
    var test;
    
    if(isNaN(POT) === false && isNaN(mott) === false)
    {
        test = true;
    }
    if(POT !== null && mott !== null && test)
     {
         getJSONConstant(POT,mott,function(data)
        {
        if(data != "ERROR")
        {
            
            var speechOutput = data;
        }
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "The derivative is "+speechOutput, "", true))

      })
     }
     else
    {
        callback(session.attributes,buildSpeechletResponse("Derive Me!", "Please tell a number along with invocation","", true))

    }
   
    
    
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












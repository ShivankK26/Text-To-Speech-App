const textarea = document.querySelector("textarea"),
voiceList = document.querySelector("select"),
speechBtn = document.querySelector("button");


//speechSynthesis is a Web Speech API interface which controls interface for the speech service; 
//this can be used to retrieve information about the synthesis voices available on the device,
//start and pause speech, and other commands besides.
let synth = speechSynthesis,
isSpeaking = true;


voices();


function voices(){
    for(let voice of synth.getVoices()){ //of statement executes a loop that operates on a sequence of values sourced from an iterable object. Iterable objects include instances of built-ins such as Array, String
        let selected = voice.name === "Google US English" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);


        //insertAdjacentHTML() method of the Element interface parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.
        //insertAdjacentHTML(position, text)
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        //Line 19 would insert all the data stored in option at the end of voicelist.
    }
}


//addEventListener() method allows you to add event listeners on any HTML DOM object such as HTML elements, 
//the HTML document, the window object, or other objects that support events, like the xmlHttpRequest object.
synth.addEventListener("voiceschanged",voices);


function textToSpeech(text){
    let utterance = new SpeechSynthesisUtterance(text); //SpeechSynthesisUtterance interface of the Web Speech API represents a speech request. It contains the content the speech service should read and information about how to read it
    for(let voice of synth.getVoices()){
        if(voice.name === voiceList.value){
            utterance.voice = voice;
        }
    }
    synth.speak(utterance); //speak() method of the SpeechSynthesis interface adds an utterance to the utterance queue; it will be spoken when any other utterances queued before it have been spoken.
}


speechBtn.addEventListener("click", e=>{
    e.preventDefault(); //preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    if(textarea.value !== ""){
        //checks if not speaking, Speech Textarea Text
        if(!synth.speaking){
            textToSpeech(textarea.value);
        }
        //if text was long then add resume and pause function
        if(textarea.value.length > 80){
            setInterval(() =>{ //setInterval() method repeatedly calls a function or executes a code snippet, with a fixed time delay between each call.
                if(!synth.speaking && !isSpeaking){ //setInterval(func, delay) or setInterval(code, delay)
                    isSpeaking = true;
                    speechBtn.innerText = "Convert To Speech";
                }else{}
            }, 500);
            if(isSpeaking){
                synth.resume();
                isSpeaking = false;
                speechBtn.innerText = "Pause Speech";
            }else{
                synth.pause();
                isSpeaking = true;
                speechBtn.innerText = "Resume Speech"; 
            }
        }else{
            speechBtn.innerText = "Convert To Speech";
        }
    }
});
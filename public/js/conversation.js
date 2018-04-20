/**
 * AJAX Post request for tone analyzer api
 * @param {String} request body text
 */
function getClasses(text)  {
  $.post('/api/classify', {'text': text }, classesCallback)
    .fail(err);
}

/**
 * Converts a tone category into a flat object with tone values
 * @param {Object} tone category returned from API
 
function getToneValues(toneCategory) {
  var tone = {};
  toneCategory.tones.forEach(function(toneValue) {
    tone[toneValue.tone_id] = +((toneValue.score * 100).toFixed(2));
  });

  return tone;
}*/
/*
function getTones(tone) {
  var tones = {};
  tone.tone_categories.forEach(function(category) {
    tones[category.category_id.split("_")[0]] = getToneValues(category);
  });
  return tones;
}*/

function classesCallback(data) {

  // Results for the updated full transcript's tone
  //tone.document = getTones(data.document_tone);

var intents = [];
  // Results for the latest sentence's tone
  //if (data.sentences_tone && data.sentences_tone[data.sentences_tone.length - 1].tone_categories.length)
      //tone.sentence = getTones(data.sentences_tone[data.sentences_tone.length - 1]);
      if(data.intents[0] != null)
        var a = {
          text:data.input.text,
          answer:data.output.text[0],
          intent: data.intents[0].intent,
          confidence: data.intents[0].confidence
        };
        intents.push(a);

  // Update Smoothie.js chart
//  toneChart.plotValues(tone);
//showMetaData(intents);

intents.forEach(function(elem){
  $('#metadataTable > tbody:last-child').append(
    '<tr>'
    + '<td>' + elem.text + '</td>'
    + '<td>' + elem.intent + '</td>'
    + '<td>' + elem.confidence + '</td>'
    + '<td>' + elem.answer + '</td>'
    + '</tr>'
  );
});

}

/**
 * Error callback for tone alaysis POST request
 * @param {Object} error
 */
function err(error) {
  console.error(error);
  var message = typeof error.responseJSON.error === 'string' ?
    error.responseJSON.error :
    'Error code ' + error.responseJSON.error.code + ': ' + error.responseJSON.error.message;
  console.error(message);
}

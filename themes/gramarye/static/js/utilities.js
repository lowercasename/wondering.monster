function randomFromArrayWithIndex(array) {
  let randomChoice = array[Math.floor(Math.random() * array.length)];
  return {
    value: randomChoice,
    index: array.indexOf(randomChoice)
  }
}

$(document).ready(function() {
  let rollTableButton = `
    <div class="roll-table__footer">
      <button type="button" class="roll-table__button"><i class="fal fa-dice-d20"></i> Roll on table</button>
      <div class="roll-table__output"></div>
    </div>
  `
  $('.roll-table').each(function() {
    $(this).append(rollTableButton);
    let outcomes = $(this).find('tr td:nth-child(2)').map(function() {
      return this.textContent;
    }).get();
    $(this).attr('data-outcomes', JSON.stringify(outcomes));
  })
});

$(document).on('click', '.roll-table__button', function() {
  let self = $(this);
  let dieIcon = $(this).find('i');
  let outputContainer = $(this).closest('.roll-table').find('.roll-table__output');
  outputContainer.html(`<span class="roll-table__output__arrow">↳</span> Rolling...`)
  dieIcon.toggleClass("rolling");
  setTimeout(function(){
    let outcomes = JSON.parse(self.closest('.roll-table').attr('data-outcomes'));
    let { value, index } = randomFromArrayWithIndex(outcomes);
    outputContainer.html(`<span class="roll-table__output__arrow">↳</span> <strong>${index + 1}</strong> ${value}`);
  }, 500);
  
})
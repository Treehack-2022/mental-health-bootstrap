var tallyAnswer = function() {
    const questions = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q9', 'Q10']
    var total = 0;
    var radios;
    for (var i=0; i<10; i++){
        radios = document.getElementsByName('choice');
        if (radios[i].checked) {
            total += radios[i].value;
            break;
        }
    }
    sessionStorage.setItem("TotalScore", total);
    var score = sessionStorage.getItem('TotalScore');
    document.getElementById('t').innerHTML = score.toString();
};

var score = sessionStorage.getItem('TotalScore');
document.getElementById('t').innerHTML = score.toString();

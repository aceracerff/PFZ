/** @jsx React.DOM */

var secretNumber = _generateSecretNumber();
var numGuesses = 0;

var PFZHighScore = React.createClass({
    render: function() {
        return (
            <h4>Current best score:</h4>

        );
    }
});

var PFZList = React.createClass({
    render: function() {
        var createItem = function(itemText, index) {
            return <li key={index + itemText}>{itemText}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
});

var PFZApp = React.createClass({
    mixins: [ReactFireMixin],
    componentWillMount: function() {
        var fbRef = new Firebase("https://pfz.firebaseio.com/guesses");
        this.bindAsObject(fbRef, "guesses")
    },
    getInitialState: function() {
        console.log(secretNumber);
        return {items: [], text: '', validation: 'error', guesses: 0};
    },
    onChange: function(e) {
        this.setState({text: e.target.value.substr(0,4)});
        this.setState({validation: "error"});
        if (_validateInput(e.target.value.substr(0,4)) == true) this.setState({validation: "success"});

    },
    handleSubmit: function(e) {
        e.preventDefault();
        this.fbRef.set(guesses: this.state.guesses))
        this.state.guesses = (parseInt(this.state.guesses) + 1);
        var nextItems = this.state.items.concat(this.state.text + _evaluateInput(this.state.text.split("")));
        var nextText = '';
        this.setState({items: nextItems, text: nextText});
    },
    render: function() {
        var Button = ReactBootstrap.Button;
        var Input = ReactBootstrap.Input;
        return (
        <div>
            <h3>Pico Fermi Zilch!</h3>
            <h4>Try to guess the 4-digit number</h4>
            <PFZList items={this.state.items} />
            <Input type="text" onChange={this.onChange} value={this.state.text} bsStyle={this.state.validation} hasFeedback />
            <Button onClick={this.handleSubmit} bsStyle="primary">{'Submit'}</Button>
            <PFZHighScore guesses={this.state.guesses} />
        </div>
        );
    }
});

function _shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function _generateSecretNumber() {
    //Here, we generate an array of four unique single-digit numbers
    var arr = ["0","1","2","3","4","5","6","7","8","9"];
    _shuffle(arr);
    return ([arr[0],arr[1],arr[2],arr[3]]);
}

function _validateInput(input) {
    var i;
    var arr = ["0","1","2","3","4","5","6","7","8","9"];
    for (i=0; i<4; i++)
    {
        if (arr.indexOf(input[i]) == -1) return false;
    }
    return true;
}

function _evaluateInput(input) {
    //Check for correct guess
    if (input.toString() == secretNumber.toString()) return "\tCorrect!";

    //Check for valid input
    if (_validateInput(input) == false) return "\tInvalid input. Enter four numbers!";

    var result = "\t";
    var count;
    for (count=0; count < 4; count++) {
        if (input[count] == secretNumber[count]) result = result.concat("Fermi\t");
    }
    count=0;
    var done = false;
    if (input[0] != secretNumber[0]) {     //Only evaluate this position if it wasn't a Fermi
        while ((!done) && (count < 4)) {   //Iterate through the position until either no matches or a Pico
            if (0 != count) {              //Don't evaluate this position against itself
                if (input[0] == secretNumber[count]) {result = result.concat("Pico\t"); done = true;}
            }
            count++;
        }
    }
    count=0; done=false;
    if (input[1] != secretNumber[1]) {
        while ((!done) && (count < 4)) {
            if (1 != count) {
                if (input[1] == secretNumber[count]) {result = result.concat("Pico\t"); done = true;}
            }
            count++;
        }
    }
    count=0; done=false;
    if (input[2] != secretNumber[2]) {
        while (!done && count < 4) {
            if (2 != count) {
                if (input[2] == secretNumber[count]) {result = result.concat("Pico\t"); done = true;}
            }
            count++
        }
    }
    count=0; done=false;
    if (input[3] != secretNumber[3]) {
        while (!done && count < 4) {
            if (3 != count) {
                if (input[3] == secretNumber[count]) {result = result.concat("Pico\t"); done = true;}
            }
            count++
        }
    }

    if (result == "\t") return "\tZilch\t";
    return result;
}

ReactDOM.render(React.createElement(PFZApp), document.getElementById("main"));
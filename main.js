
//  phaser object
var game = new Phaser.Game(340, 106, Phaser.AUTO, 'clock', true);

var titles = [];

var seconds = 12403; // enter the seconds to start from
var format = 0;

// initial "previous" time
var previous = formatTime(seconds).split("");
var text;
var clock;

// some arrays for titles, clock items, and sprites

var next = [];
var items = [];
var containerSprite = [];
var margin = 0;

// styles for characters and spacers symbol
var style = {font: "55px Arial", fontWeight: "bold", fill: "#ee519f", align: "center"};
var style2 = {font: "45px Arial", fill: "#808080", align: "center"};

// function to convert seconds to "HHMMSS" format
function formatTime(s) {
    var timeWeeks = ("0" + Math.floor(s / 604800)).substr(-2);
    var totalDays = Math.floor(s / 86400);
    var totalHrs = Math.floor(s / 3600);
    var totalMin = Math.floor(s / 60);

    var timeDays = ("0" + Math.floor(s / 86400 - (timeWeeks * 7))).substr(-2);
    var timeHours = ("0" + Math.floor(s / 3600 - (totalDays * 24))).substr(-2);
    var timeMinutes = ("0" + Math.floor((s / 60) - (totalHrs * 60))).substr(-2);
    var timeSeconds = ("0" + Math.floor(s - (totalMin * 60))).substr(-2);

    // determine time format
    var previousFormat = format;
    if (timeWeeks != "00") {
        format = 2;
        clock = timeWeeks + timeDays + timeHours;
    }
    else if (timeDays != "00") {
        format = 1;
        clock = timeDays + timeHours + timeMinutes;
    }
    else {
        format = 0;
        clock = timeHours + timeMinutes + timeSeconds;
    }

    // handle time format changes
    if (previousFormat !== format && titles[0]) {
        var text1 = (format == 2) ? 'Weeks' : (format == 1) ? 'Days' : 'Hours';
        var text2 = (format == 2) ? 'Days' : (format == 1) ? 'Hours' : 'Minutes';
        var text3 = (format == 2) ? 'Hours' : (format == 1) ? 'Minutes' : 'Seconds';
        titles[0].setText(text1);
        titles[1].setText(text2);
        titles[2].setText(text3);
    }
    return clock
}

// loop trough all characters and animate them if they were changed
function setTime() {
    next.forEach(function (char, index) {
        items[index].setText(char);
        if (char != previous[index]) {
            // scale to 0
            var tw = game.add.tween(items[index].scale).to(({y: 0}), 100, Phaser.Easing.Linear.In, true, 0);
            tw.onComplete.addOnce(show, this);
        }
        function show() {
            var tw = game.add.tween(items[index].scale).to(({y: 1}), 100, Phaser.Easing.Linear.In, true, 0);
        }
    });
}

// game state object
var theGame = {
    preload: function () {
        game.stage.backgroundColor = "#012031";

        // create texts under clock
        var textStyle = {font: "15px Arial", fontWeight: "bold", fill: "#c3c6da", align: "center"};
        var text1 = (format == 2) ? 'Weeks' : (format == 1) ? 'Days' : 'Hours';
        var text2 = (format == 2) ? 'Days' : (format == 1) ? 'Hours' : 'Minutes';
        var text3 = (format == 2) ? 'Hours' : (format == 1) ? 'Minutes' : 'Seconds';
        titles[0] = game.add.text(25, 75, text1, textStyle);
        titles[1] = game.add.text(145, 75, text2, textStyle);
        titles[2] = game.add.text(265, 75, text3, textStyle);
    },
    create: function () {
        var graphics = game.add.graphics(0, 0);
        clock = formatTime(seconds);
        if (clock) {
            previous.forEach(function (char, index) {


                // create rectangle with number and cross for each clock character
                var container;
                graphics.beginFill(0xffffff);
                graphics.drawRoundedRect(0, 0, 43, 60, 8);
                container = graphics.generateTexture();
                graphics.clear();

                containerSprite[index] = game.add.sprite(0, 0, container);
                containerSprite[index].addChild(graphics);
                containerSprite[index].x = 3 + margin;
                containerSprite[index].y = 10;


                // put cross on the middle of each character
                var cross;
                var cr = game.add.bitmapData(35, 2);
                cr.ctx.beginPath();
                cr.ctx.rect(0, 0, 35, 2);
                cr.ctx.fillStyle = '#474747';
                cr.ctx.fill();
                cross = game.add.sprite(4, 27, cr);

                items[index] = game.add.text(21, 31, char, style);
                items[index].anchor.setTo(0.5, 0.5);

                containerSprite[index].addChild(items[index]);
                containerSprite[index].addChild(cross);

                // space between each character
                margin += 44;

                // more space between each two rectangles with ":" symbol
                if (index % 2 !== 0 && index !== previous.length - 1) {
                    margin += 35;
                    var sep = game.add.text(game.world.centerX - margin + 185, game.world.centerY, ":", style2);
                    sep.anchor.setTo(0.5, 0.75);
                }
            });
        }

        // this is to simulate time decrement from the store each second
        var source = Rx.Observable.timer(100, 1000);
        var subscription = source.subscribe(
            function (x) {
                if (seconds === 0) {
                    this.complete();
                    return;
                }
                previous = formatTime(seconds).split("");
                seconds--;
                next = formatTime(seconds).split("");
                setTime();
                console.log(seconds + " seconds remaining!" + Date.now())
            },
            function (err) {
                console.log('Error: ' + err);
            },
            function () {
                console.log('completed');
            });
    },
    update: function () {

    },
    render: function () {

    }
};

game.state.add('Boot', theGame);
game.state.start('Boot');

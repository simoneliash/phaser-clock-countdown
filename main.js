
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

        if (char != previous[index]) {
            var graphics = game.add.graphics(0, 0);
            var container;
            graphics.beginFill(0xffffff);
            graphics.drawRoundedRect(0, 0, 43, 60, 8);
            container = graphics.generateTexture();
            graphics.clear();
            
            containerSprite[index] = game.add.sprite(0, 0, container);
            containerSprite[index].addChild(graphics);
            items[index] = game.add.text(0, 0, char, style);
            items[index].anchor.setTo(-0.15, 0);
            containerSprite[index].addChild(items[index]);
            
            bmd[index] = game.make.bitmapData(43, 60);
            bmd[index].drawFull(containerSprite[index]);
            bmd1[index] = game.make.bitmapData(43, 30);
            bmd2[index] = game.make.bitmapData(43, 30);
            
            var rect = new Phaser.Rectangle(0, 0, 43, 30);
            bmd1[index].copyRect(bmd[index].canvas, rect, 0, 0);
            var rect2 = new Phaser.Rectangle(0, 30, 43, 30);
            bmd2[index].copyRect(bmd[index].canvas, rect2, 0, 0);
            containerSprite[index].kill();
            
            top2[index] = game.add.sprite(0,0,bmd1[index]);
            bottom2[index] = game.add.sprite(0,0,bmd2[index]);
            top2[index].anchor.setTo(1);
            top2[index].x = top[index].x;
            top2[index].y = top[index].y;
            bottom2[index].x = bottom[index].x;
            bottom2[index].y = bottom[index].y;
            top[index].bringToTop();
            bottom2[index].scale.setTo(0);
            bottom2[index].bringToTop();

            // scale to 0
            var tw = game.add.tween(top[index].scale).to(({y: 0}), 120, Phaser.Easing.Linear.In, true, 0);
            top[index].tint = 0x777777;
            top[index].alpha = 0.6;
            tw.onComplete.addOnce(show, this);
        }
        function show() {
            var tw2 = game.add.tween(bottom2[index].scale).to(({y:1}), 120, Phaser.Easing.Linear.In, true, 0);
            bottom[index].alpha = 0.6;
            bottom2[index].scale.setTo(1);
            tw2.onComplete.addOnce(completed, this);
        }

        function completed() {
            bottom[index].kill();
            top[index].kill();
            top[index] = top2[index];
            bottom[index] = bottom2[index];
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

                items[index] = game.add.text(0, 0, char, style);
                items[index].anchor.setTo(-0.15, 0);

                containerSprite[index].addChild(items[index]);
                bmd[index] = game.make.bitmapData(43, 60);

                bmd[index].drawFull(containerSprite[index]);
                bmd1[index] = game.make.bitmapData(43, 30);

                bmd2[index] = game.make.bitmapData(43, 30);
                var rect = new Phaser.Rectangle(0, 0, 43, 30);
                bmd1[index].copyRect(bmd[index].canvas, rect, 0, 0);
                var rect2 = new Phaser.Rectangle(0, 30, 43, 30);

                bmd2[index].copyRect(bmd[index].canvas, rect2, 0, 0);
                top[index] = game.add.sprite(0,0,bmd1[index]);

                bottom[index] = game.add.sprite(0,0,bmd2[index]);

                top[index].x = 46 + margin;
                top[index].y = 39;
                top[index].anchor.setTo(1);
                bottom[index].x = 3 + margin;
                bottom[index].y = 40;

                containerSprite[index].kill();
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

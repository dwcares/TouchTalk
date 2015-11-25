(function () {
    "use strict";
    var _menuWidth = 300;
    var app = WinJS.Application;

    app.onactivated = function (args) {
        document.querySelector(".viewport").scrollLeft = _menuWidth;
        WinJS.UI.processAll().then(init);
    };


    /////////////// TOUCH SLIDER /////////////////
     var sliderButton;
    var HEIGHT_THRESHOLD = 70;
    var COMMIT_PADDING = 5;
    var COMMIT_THRESHOLD = HEIGHT_THRESHOLD - COMMIT_PADDING;
    var _commitTimer;

    // Setup the event handlers
    function initButton() {
        sliderButton = document.querySelector(".sliderButton");

        var roundButton = document.querySelector(".roundButton");
        WinJS.Utilities.addClass(roundButton, "ManipulationElement");
        roundButton.addEventListener("pointerdown", downHandler);
        roundButton.addEventListener("MSGestureChange", touchHandler);
        roundButton.addEventListener("pointerup", upHandler);
        roundButton.addEventListener("MSInertiaStart", onInertiaStart);
        roundButton.addEventListener("MSGestureEnd", onGestureEnd, false);
    }

    // What happens when someone puts their finger on the button
    function downHandler(eventObject) {
        try {
            var target = getManipulationElement(eventObject.target);
            target.gestureObject.addPointer(eventObject.pointerId);
            target.gestureObject.pointerType = eventObject.pointerType;
            WinJS.Utilities.addClass(sliderButton, "on");

        } catch (e) {
            debugger;
        }
    }

    // What happens you move your finger on the button
    function touchHandler(eventObject) {
        var target = getManipulationElement(eventObject.target);

        if (Math.abs(target.translationY + eventObject.translationY) < COMMIT_THRESHOLD) {
            WinJS.Utilities.removeClass(target, "commit");
        } else {
            WinJS.Utilities.addClass(target, "commit");
        }

        if (Math.abs(target.translationY + eventObject.translationY) < HEIGHT_THRESHOLD) {
            target.translationY += eventObject.translationY;
            
            // ****** STEP 2: Move the button, stick to your finger
            target.style.transform = "translateY(" + target.translationY + "px)";
        }
    }

    // What happens when you lift your finger
    function upHandler(e) {
        var target = getManipulationElement(e.target);
        WinJS.Utilities.removeClass(sliderButton, "on");
    }

    // The inertia after you lift your finger
    function onInertiaStart(e) {
        var target = getManipulationElement(e.target);
        target.gestureObject.stop(e.pointerId);
    };

    // What happens when you finish moving your finger on the button
    function onGestureEnd(e) {
        var target = getManipulationElement(e.target);

        if (target.translationY >= COMMIT_THRESHOLD) {
            makeLowerCase();
        } else if (target.translationY <= 0 - COMMIT_THRESHOLD) {
            makeUpperCase();
        }

        WinJS.Utilities.removeClass(sliderButton, "on");
        WinJS.Utilities.removeClass(target, "commit");

        target.translationY = 0;
        target.gestureObject.pointerType = null;
        target.gestureObject.stop(e.pointerId);
        target.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
    }

    function makeUpperCase() {
        document.querySelector(".loremText").style.textTransform = "uppercase";
    }

    function makeLowerCase() {
        document.querySelector(".loremText").style.textTransform = "lowercase";
    }

    // A helper that goes and gets the right element (if you have nested elements)
    function getManipulationElement(element) {
        var retValue = element;
        while (!WinJS.Utilities.hasClass(retValue, "ManipulationElement")) {
            retValue = retValue.parentNode;
        }

        if (retValue.translationY === null || typeof retValue.translationY === "undefined") {
            retValue.translationY = 0;
        }

        if (retValue.gestureObject === null || typeof retValue.gestureObject === "undefined") {
            retValue.gestureObject = new MSGesture();
            retValue.gestureObject.target = retValue;
        }
        return retValue;
    };
    
    /////////////// HAMBURGER ////////////////////

    function returnToContent(e) {
        var viewport = document.querySelector(".viewport");
        if (viewport.scrollLeft < _menuWidth) {
            viewport.msZoomTo({
                viewportX: _menuWidth
            });
        }
        else if (viewport.scrollLeft >= _menuWidth * 2) {
            viewport.msZoomTo({
                contentX: _menuWidth
            });
        }
    }

    function toggleMenu(e) {
        var viewport = document.querySelector(".viewport");
        var scrollPos = (viewport.scrollLeft > 0) ? 0 : _menuWidth;
        viewport.msZoomTo({
            contentX: scrollPos
        });

        e.stopPropagation();
    }
    
    /////////////////// INIT /////////////////
    function init() {
        initButton();
        var popVisible = false;
                
        var sliderButton = document.querySelector(".sliderButton");
        document.body.addEventListener('selectstart', function(e){e.preventDefault(); return false;}, false)
        document.querySelector(".viewport").style.opacity = 1;
        document.querySelector(".header .hamburger").addEventListener("click", toggleMenu);
        document.querySelector(".content").addEventListener("click", returnToContent);
        document.querySelector(".menu-right.menu").winControl.addEventListener("refresh", function (e) {
            setTimeout(function () {
                document.querySelector(".menu-right.menu").winControl.refreshing = false;
            }, 1500)
        });
        
        document.querySelector(".viewport").addEventListener("scroll", function(e) {
            if (e.currentTarget.scrollLeft === _menuWidth) {
               WinJS.Utilities.addClass(sliderButton, "pop");  
               popVisible = true; 
                
            } else if (popVisible) {
               popVisible = false;
               WinJS.Utilities.removeClass(sliderButton, "pop");   
            }
        });
    }
    

    var itemArray = new WinJS.Binding.List([
{ title: "Marvelous Mint", text: "Gelato", picture: "/images/fruits/60Mint.png" },
{ title: "Succulent Strawberry", text: "Sorbet", picture: "/images/fruits/60Strawberry.png" },
{ title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "/images/fruits/60Banana.png" },
{ title: "Lavish Lemon Ice", text: "Sorbet", picture: "/images/fruits/60Lemon.png" },
{ title: "Creamy Orange", text: "Sorbet", picture: "/images/fruits/60Orange.png" },
{ title: "Very Vanilla", text: "Ice Cream", picture: "/images/fruits/60Vanilla.png" },
{ title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "/images/fruits/60Banana.png" },
{ title: "Lavish Lemon Ice", text: "Sorbet", picture: "/images/fruits/60Lemon.png" },
{ title: "Marvelous Mint", text: "Gelato", picture: "/images/fruits/60Mint.png" },
{ title: "Succulent Strawberry", text: "Sorbet", picture: "/images/fruits/60Strawberry.png" },
{ title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "/images/fruits/60Banana.png" },
{ title: "Lavish Lemon Ice", text: "Sorbet", picture: "/images/fruits/60Lemon.png" },
{ title: "Creamy Orange", text: "Sorbet", picture: "/images/fruits/60Orange.png" },
{ title: "Very Vanilla", text: "Ice Cream", picture: "/images/fruits/60Vanilla.png" },
{ title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "/images/fruits/60Banana.png" },
{ title: "Lavish Lemon Ice", text: "Sorbet", picture: "/images/fruits/60Lemon.png" },
{ title: "Marvelous Mint", text: "Gelato", picture: "/images/fruits/60Mint.png" },
{ title: "Succulent Strawberry", text: "Sorbet", picture: "/images/fruits/60Strawberry.png" },
{ title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "/images/fruits/60Banana.png" },
{ title: "Lavish Lemon Ice", text: "Sorbet", picture: "/images/fruits/60Lemon.png" },
{ title: "Creamy Orange", text: "Sorbet", picture: "/images/fruits/60Orange.png" },
{ title: "Very Vanilla", text: "Ice Cream", picture: "/images/fruits/60Vanilla.png" },
{ title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "/images/fruits/60Banana.png" },
{ title: "Lavish Lemon Ice", text: "Sorbet", picture: "/images/fruits/60Lemon.png" },
    ]);

    var grouped = itemArray.createGrouped(function (item) {
        return item.text;
    }, function (item) {
        return {
            title: item.text
        };
    }, function (left, right) {
        return left.charCodeAt(0) - right.charCodeAt(0);
    });

    WinJS.Namespace.define("App", {
        data: grouped
    });

    app.start();
})();
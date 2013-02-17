/**
 *
 * Use :
 * $(selector).hoverintent(myEnterFunction, myLeaveFunction [, options]);
 * $(selector).mouseenterintent(myFunction [, options]);
 * $(selector).mouseleaveintent(myFunction [, options]);
 * $(selector).bind('mouseenterintent' [, options], myFunction);
 * $(selector).bind('mouseleaveintent' [, options], myFunction);
 *
 * Options :
 *   maxSpeed           : (default: 150) mouse cursor must go slower than this maximum mouse speed (pixels/s)
 *   enterTimeout       : (default: 500) if mouse cursor stay this time (ms) inside the element the enter event is triggered
 *   leaveTimeout       : (default: 300) if mouse cursor go out of the element more than this time (ms) the leave event is triggered
 *   checkSpeedInterval : (default: 40) interval for mouse speed checks (can't be lower than 10)
 *   group              : (default: false) treat all nodes in the jQuery selection as one element
 *
 *
 * This script was inspired by a script written by : Brian Cherne <brian@cherne.net>
 *
 * Free to use, free to study, free to change, free to redistibute
 *
 * @author  : Nicolas Deveaud <nicolas@deveaud.fr>
 * @version : 1.4.1 (realease date: june 26 2011)
 */

(function (setTimeout, setInterval, clearTimeout, clearInterval, Error, Math, $, undef) {
    "use strict";

    if ($ === undef) {
        throw new Error('Unsolved Dependency : jQuery');
    }

    function bind(methodName, context) {
        var method = context[methodName];
        context[methodName] = function() {
            return method.apply(context, arguments);
        };
    }

    function HoverIntent(elem, options) {
        bind('mousemove', this);
        bind('stopEnterEngine', this);
        bind('triggerEvent', this);
        bind('triggerMouseEnter', this);
        bind('checkSpeed', this);
        bind('hoverHandler', this);

        if (this.getInstance(elem, options) === this) {
            this.init(elem, options);
        }
    }

    HoverIntent.prototype = {

        getInstance : function getInstance(elem, options) {
            var $elem = $(elem);
            var instance = $elem.data('HoverIntent');

            if (!instance) {
                instance = this;
                $elem.data('HoverIntent', this);
            }
            else {
                instance.changeOptions(options);
            }

            return instance;
        },

        init : function init(elem, options) {
            // Stores current cursor position
            this.cur = {};

            // Stores previous cursor position
            this.prv = {};

            this.elem = elem;
            this.$elem = $(elem);

            this.options = $.extend({
                maxSpeed        : -1,
                enterTimeout    : 0,
                leaveTimeout    : 0
            }, options);

            // It's useless, and probably bad for perfs to have a value under 10
            // for speed check interval. So bad values are not used
            if (!this.options.checkSpeedInterval || this.options.checkSpeedInterval < 10) {
                this.options.checkSpeedInterval = 10;
            }

            // Start handling mouseenter and mouseleave events
            this.$elem
                .bind('mouseenter mouseleave', this.hoverHandler);
        },

        // When the "enter engine" is started, on every mouse move, the cursor
        // location is registered to be able to get the mouse speed
        mousemove : function mousemove(e) {
            this.cur.X = e.pageX;
            this.cur.Y = e.pageY;
        },

        // Some things to be done before throwing the mouse enter event, or when
        // mouse enter is aborted :
        //     Stop cheking speed every [options.checkSpeedInterval]ms
        //     Abort enter timeout
        //     Stop mousemove event handling
        stopEnterEngine : function stopEnterEngine() {
            clearInterval(this.checkSpeedInterval);
            clearTimeout(this.timeoutEnter);
            this.$elem.unbind('mousemove', this.mousemove);
            this.prv = {};
        },

        // Triggers the event
        triggerEvent : function triggerEvent() {
            this.inside = !this.inside;
            this.event.type = this.inside ? 'mouseenterintent' : 'mouseleaveintent';
            $.event.handle.call(this.elem, this.event);
        },

        // for mouseEnter, we have some things to do before throwing the event
        triggerMouseEnter : function triggerMouseEnter() {
            this.stopEnterEngine();
            this.triggerEvent();
        },

        // Every [options.checkSpeedInterval]ms, we check mouse speed. If it's
        // lower than [options.maxSpeed]px/s the event is thrown
        checkSpeed : function checkSpeed() {
            if (this.prv.X !== undef && this.prv.Y !== undef) {
                var speed = (Math.sqrt(Math.pow(this.prv.X - this.cur.X, 2) + Math.pow(this.prv.Y - this.cur.Y, 2)) / this.options.checkSpeedInterval) * 1000;
                if (speed <= this.options.maxSpeed) {
                    this.triggerMouseEnter();
                }
            }
            this.prv.X = this.cur.X;
            this.prv.Y = this.cur.Y;
        },

        // What to do when mouse cursor enters or leaves the HTML object (real
        // event, not intent)
        hoverHandler : function hoverHandler(e) {
            // Register the event to be thrown
            this.event = e;

            // Abort entering
            this.stopEnterEngine();

            // Stops the leave timeout if it has been started
            clearTimeout(this.timeoutLeave);

            if (e.type === 'mouseenter' && !this.inside) {
                // start the enter engine :
                //     start handling mousemove event
                //     each [options.checkSpeedInterval]ms => check speed
                //     after [options.enterTimeout]ms without leaving => trigger the enter event

                // If maxSpeed is set to negative, no speed check, only timeout
                /// will work
                if (this.options.maxSpeed >= 0) {
                    this.$elem.mousemove(this.mousemove);
                    this.checkSpeedInterval = setInterval(this.checkSpeed, this.options.checkSpeedInterval);
                }
                this.timeoutEnter = setTimeout(this.triggerMouseEnter, this.options.enterTimeout);
            }
            else if (e.type === 'mouseleave' && this.inside) {
                // Start leave timeout that will throw the event, unless mouse
                // enters before timeout ends
                this.timeoutLeave = setTimeout(this.triggerEvent, this.options.leaveTimeout);
            }
        },

        changeOptions : function changeOptions(opt) {
            var i;
            for (i in opt) {
                if (typeof opt[i] === 'number') {
                    this.options[i] = opt[i];
                }
            }
        },

        unbind : function unbind(eventName) {
            if (eventName === 'enter') {
                this.options.enterTimeout = 0;
                this.options.maxSpeed = -1; // no need to check speed => better for perfs
            }
            else if (eventName === 'leave') {
                this.options.leaveTimeout = 0;
            }
            // Il n'est peut-être pas bon de couper les captures d'événements.
            // Si j'ai des timeout à 0, cela revient à un hover simple. Et si j'unbind le
            // enterintent seulement par exemple, avec les unbind je vais me retrouver sans
            // leaveintent non plus... Alors que je voudrais qu'il se comporte toujours comme
            // un leave normal.
/*          if (this.options.enterTimeout === 0 && this.options.leaveTimeout === 0) {
                this.$elem
                    .unbind('mousemove', this.mousemove)
                    .unbind('mouseleave mouseenter', this.hoverHandler)
                    .removeData('hoverintent');
            }
*/
      }
    };

    // Shortcut function to declare both enter and leave special events
    function specialEventSetter(eventName, defaultValues) {
        return {
            setup: function (options) {
                options = $.extend({}, defaultValues, options);
                $(this)
                    .each(function () {
                        new HoverIntent(this, options);
                    });
            },

            teardown: function () {
                var instance = $(this).data('HoverIntent');
                if (instance) {
                    instance.unbind(eventName);
                }
            }
        };
    }

    // Declaring special events
    $.event.special.mouseenterintent = $.event.special.mouseenterintent ||
        specialEventSetter('enter', {
            maxSpeed            : 150,
            enterTimeout        : 500,
            checkSpeedInterval  : 40
        });

    $.event.special.mouseleaveintent = $.event.special.mouseleaveintent ||
        specialEventSetter('leave', {
            leaveTimeout : 300
        });


    // Declaring jQuery plugins
    $.fn.mouseenterintent = $.fn.mouseenterintent || function mouseenterintent(fn, options) {
        if (typeof options === 'number') {
            options = {maxSpeed : options};
            if (typeof arguments[2] === 'number') {
                options.enterTimeout = arguments[2];
            }
            if (typeof arguments[3] === 'number') {
                options.checkSpeedInterval = arguments[3];
            }
        }
        return this.bind('mouseenterintent', options, fn);
    };

    $.fn.mouseleaveintent = $.fn.mouseleaveintent || function mouseleaveintent(fn, options) {
        if (typeof options === 'number') {
            options = {leaveTimeout : options};
        }
        return this.bind('mouseleaveintent', options, fn);
    };

    $.fn.hoverintent = $.fn.hoverintent || function hoverintent(fnin, fnout, options) {
        if(options && options.group) {

            // if the "group" option is true, we use a "spectre" object to
            // represente the nodes group. Than we transmit events from the
            // nodes to the "spectre" object.
            var spectre = $({
                    cible   : this
                });

            spectre
                .bind('mouseenterintent', function() {
                    fnin.apply(this.cible, arguments);
                })
                .bind('mouseleaveintent', options, function() {
                    fnout.apply(this.cible, arguments);
                });

            return this.bind('mouseenter mouseleave mousemove', function(evt) {
                spectre.trigger(evt.type, evt);
            });
        }
        // Both events will be manage with the same HoverIntent instance, so we can set options just on the second one, it will impact the first event too.
        return this
            .bind('mouseenterintent', fnin)
            .bind('mouseleaveintent', options, fnout);
    };


    // Compatibility with Brian Cherne's plugin
    $.fn.hoverIntent = $.fn.hoverIntent || function(f, g) {
        var cfg = $.extend({}, g ? { over: f, out: g } : f ),
            options = {};

        if(cfg.sensitivity) {
            // Convert sensibility to maxSpeed.
            // TODO : Find a good convertion algorythm. This one is just quick and durty.
            options.maxSpeed = (cfg.sensitivity / 7) * 150;
        }

        if(cfg.timeout) {
            options.leaveTimeout = cfg.timeout;
        }

        if(cfg.interval) {
            options.checkSpeedInterval = cfg.interval;
        }

        return $.fn.hoverintent.apply(this, [cfg.over, cfg.out, options]);
    };

}(this.setTimeout, this.setInterval, this.clearTimeout, this.clearInterval, this.Error, this.Math, this.jQuery));
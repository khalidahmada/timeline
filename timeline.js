/**
 * timeline.js v0.11.4
 * (c) 2015 Khalid Ahmada
 * Released under the MIT License.
 */
(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define(factory);
    else if (typeof exports === 'object')
        exports["timeline"] = factory();
    else
        root["timeline"] = factory();
})(this, function() {
        // static function
        var fn = function() {};

        // Local variables
        var arraytimeline = [];

        /*
         * Helpers
         */

        // timeline helpers
        var timeline_helper = {
            exist: function(id) {
                return arraytimeline[id] ? true : false;
            },
            _extend: function(obj, ext) {
                for (var i in ext) {
                    obj[i] = obj[i] ?
                        obj[i] :
                        ext[i]
                }
                return obj;
            },
            _fn: function(fncall) {
                return fncall ?
                    fncall :
                    fn;
            },
            framesnotformated: function(frames) {

                // Should have one frame minimum
                var keys = Object.keys(frames);
                if (keys.length <= 0) {
                    return -1;
                }
                for (var i in frames) {
                    if (i.substr(0, 2) != 'f_') {
                        return true;
                    }
                }

                return false;
            },
            get: {
                timeline: function(id) {
                    if (!id) {
                        throw "You should specify the timeline id";
                        return;
                    }
                    if (!timeline_helper.exist(id)) {
                        throw " Timeline Error : timeline " + id + " is not exist";
                        return false;
                    } else {
                        return arraytimeline[id];
                    }
                },
                totalduration: function(frames) {
                    var maxtime = 0;

                    for (var keys = Object.keys(frames), i = 0, end = keys.length; i < end; i++) {
                        var key = keys[i],
                            value = frames[key],
                            cval = Number(key.substr(2));
                        maxtime = (cval >= maxtime ? cval : maxtime);
                    }

                    return maxtime;
                },
                totalframes: function(frames) {
                    return Object.keys(frames).length;
                }
            },
            frame_exist: function(index) {
                if (this.totalframes - 1 < index)
                    return false;
                else
                    return true;
            }
        }

        // default options
        var _options = {
            id: "", // id Time Line name unique,
            $el: {}, // dom element
            frames: {}, // farames of timelines
            complete: fn, // callback on timeline
            onrepeat: fn, // Callback on each repeat
            tick: fn, // each tick 
            loop: 0, // loop flag number of repeat (-1) loop infiniti
            fps: 35, // frames speed
            step: fn // each steep between frames
        }


        // class timeline
        var createtimeline = function(ops) {
            this.ops = timeline_helper._extend(ops, _options);
            this.$el = ops.$el;
            this.id = ops.id;
            this.frames = this.ops.frames;
            this.totalduration = 0;
            this.totalframes = timeline_helper.get.totalframes(this.frames);
            this.currentduration = 0;
            // lcoal variable
            var _this = this,
                _ops = this.ops,
                _status = 'init',
                _cusror = 0,
                _interval = 0,
                _looped = 0;


            var animateisEnd = function() {
                return _cusror >= _this.totalduration;
            }
            var init = function() {
                _this.totalduration = timeline_helper.get.totalduration(_ops.frames);
            }

            // set the cursor
            var _setCursor = function(cursor) {
                _cusror = cursor;
                _this.currentduration = _cusror;
            }

            var completehndlr = function() {
                if (_ops.complete) {
                    _ops.complete.apply(_this, [_this]);
                }
            }

            var repeatHnalder = function() {
                // trigger onrepeat handler
                if (_ops.onrepeat) {
                    _ops.onrepeat.apply(_this, [_this]);
                }
            }

            var resettime = function() {
                    // kill timer
                    _this.kill();
                    _setCursor(0);
                }
                // each tik handler
            var tickhandler = function() {
                    _ops.tick.apply(_this, [_this]);
                }
                // each step between frames
            var stephandler = function() {
                    _ops.step.apply(_this, [_this]);
                }
                // Animate complete global handler
            var _animcomplete = function() {

                if (_ops.loop == -1) {
                    resettime();
                    // replay anim
                    _this.play(_cusror);

                    // call onrepeat handler
                    repeatHnalder();
                    // call oncomplete handler
                    completehndlr();
                } else {
                    if (_ops.loop > 0) {
                        if (_looped + 1 < _ops.loop) {

                            resettime();
                            // replay anim
                            _this.play(_cusror);
                            _looped++;

                            // call replay handler
                            repeatHnalder();
                        } else {
                            // clear timer
                            resettime();
                            // call complete handler
                            completehndlr();

                        }
                    }
                }
            }


            var _tick = function() {
                var _cval = _cusror + 1;
                _setCursor(_cval);
                // call frame
                if (_this.frames['f_' + _cusror]) {
                    _this.frames['f_' + _cusror].apply(_this, [_this]);
                    stephandler();
                }

                // if the frame end 
                // trigger end
                if (_cusror > _this.totalduration) {
                    // clear timer and call complete handler
                    _this.kill();
                    _animcomplete();
                }

                // call tick handler
                tickhandler();
            }



            // var start timeline
            var startTimeLine = function() {
                    _this.kill();

                    _interval = setInterval(function() {
                        _tick();
                    }, _ops.fps);
                }
                // play timeline
            this.play = function(frame) {
                // strat the time line
                _setCursor(frame);
                startTimeLine();
            }

            // pause timeline
            this.pause = function(frame) {

                }
                // kill timeline
            this.kill = function() {
                    // clear Interval
                    clearInterval(_interval);
                }
                //reverse timeline
            this.reverse = function() {

                }
                //resume timeline
            this.resume = function() {

                    if (animateisEnd()) {
                        _setCursor(0);
                    }
                    this.play(_cusror);
                }
                // stop timeline
            this.stop = function() {
                this.kill();
            }

            // cast frame
            this.cast = function(framename) {
                if (_this.frames[framename]) {
                    _this.frames[framename].apply(_this, [_this]);
                } else {
                    throw "Frame " + framename + " is not exist on timeline " + _this.id;
                }
            }

            // constractor 
            init();
        }

        return {
            // add new Timeline

            add: function(id, $el, frames, options) {
                // options test
                options = options || {};
                // test if the timeline id is not already exist 
                if (timeline_helper.exist(id)) {
                    throw "Timeline Error : " + id + " already exist !";
                    return;
                }
                var formated_frames = timeline_helper.framesnotformated(frames);
                // test if frames is nomed and exits
                if (formated_frames) {
                    throw "Timeline Error : the frames should be like this f_index exemple f_0 or f_10 etc";
                    return;
                } else {
                    // if there is no frames
                    if (formated_frames == -1) {
                        throw "Timeline Error the timeline : " + id + " should have minimal one frame f_0";
                        return;
                    }
                }

                // make isntance and register timeline
                arraytimeline[id] = new createtimeline({
                    id: id,
                    $el: $el,
                    frames: frames,
                    complete: timeline_helper._fn(options.complete),
                    onrepeat: timeline_helper._fn(options.onrepeat),
                    tick: timeline_helper._fn(options.tick),
                    step: timeline_helper._fn(options.step),
                    loop: options.loop || _options.loop,
                    fps: options.fps || _options.fps
                });
            },
            // Play
            play: function(id, frameid) {
                // if the time line is not exist
                var _timeline = timeline_helper.get.timeline(id);

                if (_timeline) {
                    _timeline.play(frameid || 0);
                }

            },
            // resume
            resume: function(id) {
                // if the time line is not exist
                var _timeline = timeline_helper.get.timeline(id);

                if (_timeline) {
                    _timeline.resume();
                }
            }
        }

    }

    /******/
);
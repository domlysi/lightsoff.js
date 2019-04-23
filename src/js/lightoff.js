(function ($) {
    let init = true;
    let body = $('body');
    let overlayClass = 'lightsOffOverlay';
    let overlaySelector = '.' + overlayClass;
    let lightoff_button = 'lightoff_button';
    let current_charge_status = 0;

    $.fn.lightoff = function (options) {
        let defaults = {
            color: 'black',
            opacity: '.8',
            zIndex: '998',
            allowScrolling: true,
            max_charge: 150,
            instruction_text: '<span>Heat-powered!</span><br>Put your finger here',
        };
        let settings = $.extend({}, defaults, options );

        let lightoff = {
            init: function () {
                let overlay = lightoff.dimScreen();
                let charge_btn = lightoff.addButton();
                let battery_ele = lightoff.addBattery();
                let container = lightoff.addInterface([charge_btn, battery_ele,]);
                let instructions_container = lightoff.addInstructions();

                lightoff.charge(charge_btn);
                lightoff.dimmer(overlay);
            },

            charge: function(btn) {
                let decharge_timer = null;

                var up = function (e) {
                    clearInterval(decharge_timer);
                    console.log('charging');
                    timeout = setInterval(function () {
                        if (current_charge_status < settings.max_charge) {
                            current_charge_status += 1;
                            $(document).trigger('lightoff');
                        }
                        console.log(current_charge_status);
                    }, 10);
                };

                var down = function (e) {
                    clearInterval(timeout);
                    console.log('stopped');
                    decharge_timer = setInterval(function () {
                        if (current_charge_status > 0) {
                            current_charge_status -= .1;
                            $(document).trigger('lightoff');
                        }
                    }, 1);
                };

                $(btn).on('mousedown touchstart', up);
                $(btn).on('mouseup touchend', down);


            },
            dimmer: function(overlay) {

                $(document).on('lightoff', function () {
                    $(overlay).css('opacity', 1 - current_charge_status / 100);


                    let battery =  $('#lightoff_battery_level');
                    let battery_height = 0;
                    if (current_charge_status > 100) {
                        battery_height = 100;
                    } else {
                        battery_height = current_charge_status;
                    }

                    if (battery_height < 15) {
                        battery.addClass('alert');
                        battery.removeClass('warn');
                    }
                    else if (battery_height < 50 ) {
                        battery.addClass('warn');
                        battery.removeClass('alert');
                    } else {
                        battery.removeClass('warn');
                        battery.removeClass('alert');
                        $('#lightoff_instructions').hide();
                    }

                    battery.css('height', battery_height + "%");
                    console.log('changing opacity')
                })
            },

            dimScreen : function () {
                let overlay = $('<div />').attr({'id' : overlayClass, 'class' : overlayClass}).appendTo(body);
                $('<style>' +
                    overlaySelector + ' {' +
                    'position: fixed;' +
                    'display: none;' +
                    'background: '+ settings.color + ';' +
                    'opacity: ' + settings.opacity + ';' +
                    'z-index: ' + settings.zIndex + ';' +
                    'top: 0;' +
                    'bottom: -4rem;' +
                    'left: 0;' +
                    'right: 0;' +
                    'pointer-events: none;' +
                    '}' +
                    '</style>').appendTo(body);
                overlay.show();
                return overlay;
            },

            addInterface: function(elements) {
                let container = $('<div />').attr({'id': 'lightoff_container'}).css({
                    'position' : 'fixed',
                    'right' : '2rem',
                    'bottom' : '2rem',
                    'width' : '5rem',
                    // 'height' : '5rem',
                    'zIndex' : '999',
                    'display' : 'flex',
                    'flex-direction' : 'column',
                });
                let wrapper = $('<div />').attr({'id': 'lightoff_wrapper'}).css({
                    'position': 'relative',
                });
                container.append(wrapper);

                for(let i=0; i < elements.length; i++) {
                    container.append(elements[i]);
                }
                container.appendTo(body);
                return container;
            },

            addButton: function () {
                return $('<div />').attr({'id': 'lightoff_button'}).css({

                });
            },

            addBattery: function () {
                let battery = $('<div />').attr({'id': 'lightoff_battery', 'class': 'battery'});
                let battery_inner =  $('<div />').attr({'id': 'lightoff_battery_level', 'class': 'battery-level alert'});
                battery.append(battery_inner);


                return battery;
            },

            addInstructions: function () {
                let instructions_container = $('<div />').attr({'id': 'lightoff_instructions', 'class': 'lightoff_instructions'});

                let text = settings.instruction_text;

                instructions_container.append($('<h1 />').attr({}).html(text));
                $('#lightoff_wrapper').append(instructions_container);
                return instructions_container;
            }
        };
        lightoff.init()
    };

}( jQuery ));
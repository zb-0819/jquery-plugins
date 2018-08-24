/**
 * jquery activitystep 活动步骤展示
 * @version 1.0.0
 * @author BEN
 * @date 2018/08/24
 *
 * @调用方法
 * $(element).activitystep();
 */
 ; (function(factory) {
 	// 组件化
 	if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD或CMD
        define([ "jquery" ],factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        //Browser globals
        factory(jQuery);
    }
 }(function($){
 	"use strict"; // jshint
 	var ActivityStep = function(element, options) {
 		this._init(element, options);
 	}
 	
 	ActivityStep.prototype = {
 		/**
 		 * 初始化
 		*/
 		_init: function(element, options) {

 			this.$element = $(element);

 			this._setOptions(options);
 			this._render();
 		},

 		/**
 		 * 事件监听
 		*/
 		_listen: function() {

 		},

 		/**
 		 * 更新参数
 		*/
 		_setOptions: function(options) {
			this.options = $.extend({}, (this.options || $.fn.activityStep.defaults), options);

 		},

 		/**
 		 * 渲染页面
 		*/
 		_render: function() {
 			var tempHtml = '';

 			tempHtml = this._buildStepItem();
 			this.$element.empty();
 			if(tempHtml) {
 				this.$element.append(tempHtml);
 			}
 		},

 		/**
 		 * 结构
 		*/
 		_buildStepItem: function() {
 			var itemContainer = $('<div></div>'),
 				itemContent = '',
 				itemChild = '';

 			if(!Array.isArray(this.options.stepObj) || this.options.stepObj == [] || this.options.stepObj.length == 0) {
 				throw '请设置活动步骤!';
 				return;
 			} else {
 				var stepObj = this.options.stepObj;
 				for(var i=0; i<stepObj.length; i++) {
 					itemChild = $('<span class="step-title"><span class="step-id">'+ stepObj[i].id +'</span><span class="step-name">'+ stepObj[i].name +'</span></span><div class="line"></div>');
 					itemContent = $('<div></div>');
 					itemContent.addClass(this.options.itemContentClass).append(itemChild);
 					itemContainer.addClass(this.options.itemContainerClass).append(itemContent);
 					// 最后一步删除连线
 				}
 			}
 			return itemContainer;
 		},

 	};
 	$.fn.activityStep = function(option) {
 		var args = arguments,
 			result = null;

 		$(this).each(function (index, item) {
 			var $this = $(item),
                data = $this.data('activityStep'),
                options = (typeof option !== 'object') ? null : option;

            if(!data) {
            	data = new ActivityStep(this, options);
            	$this = $(data.$element);
            	$this.data('activityStep', data);
            	return;
            }

            if(typeof option === 'string') {
            	if(data[option]) {
            		result = data[option].apply(data, Array.prototype.slice.call(args, 1));
            	} else {
            		throw "Method " + option + " does not exist";
            	}
            } else {
            	result = data._setOptions(option);
            }
 		});

 		return result;
	};

	$.fn.activityStep.defaults = {
		stepObj: [],
		itemContainerClass: 'step-panel',
		itemContentClass: 'step-item',
	};

	$.fn.activityStep.Constructor = ActivityStep;
 }));
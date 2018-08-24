/**
 * jquery pagination 分页插件
 * @version 1.0.0
 * @author BEN
 * @date 2018/07/01
 *
 * @调用方法
 * $(element).pagination();
 */
// 隔离作用域
;(function (factory) {
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
}(function ($) {

	//默认配置参数
	var defaults = {
		totalAmount: 0,			// 数据总条数
		showAmount: 0,			// 每页显示的条数
		totalPages: 9,			// 总页数,默认为9
		currentPage: 1,			// 当前第几页
		shouldShowPage: false,	// 首页和尾页
		prevClass: 'prev',		// 上一页class
		nextClass: 'next',		// 下一页class
		prevIcon: '<',		    // 上一页icon
		nextIcon: '>',		    // 下一页icon
		activeClass: 'active',	// 当前页选中class
		hidePages: false,		// 当前页数为0页或者1页时不显示分页
		homePage: '',			// 首页节点html
		endPage: '',			// 尾页节点html
		keepDisplay: false,		// 是否一直显示上一页下一页
		count: 3,				// 当前页前后分页个数
		jump: false,			// 跳转到指定页数
		jumpInpClass: 'jump-input',	// 文本框内容
		jumpBtnClass: 'jump-btn',	// 跳转按钮
		jumpBtn: '跳转',		// 跳转按钮文本
		callback: function(){}	// 回调
	};

	var Pagination = function(element,options){
		//全局变量
		var opts = options,//配置
			currentPage,//当前页
			$document = $(document),
			$obj = $(element);

		/**
		 * _setTotalPages 设置总页数
		 * @param {number} page 页码
		 * @return opts.totalPages 总页数配置
		 */
		this._setTotalPages = function(page){
			if(page > opts.totalPages || page < 1) {
				throw "Page out of range";
			}
			return opts.totalPages = page;
		};

		/**
		 * _getTotalPages 获取总页数
		 * @return {number} 总页数
		 */
		this._getTotalPages = function(){
			return opts.totalAmount || opts.showAmount ? Math.ceil(parseInt(opts.totalAmount) / opts.showAmount) : opts.totalPages;
		};

		/**
		 * _getCurrentPage 获取当前页 
		 * @return {number} currentPage 当前页码
		 */
		this._getCurrentPage = function(){
			return currentPage;
		};

		/**
		 * _renderPages 渲染分页结构 
		 * @param {number} index 页码
		 */
		this._renderPages = function(index){
			var html = '';
			currentPage = index || opts.currentPage; //当前页码
			var totalPages = this._getTotalPages(); //获取的总页数
			html += '<div class="paginator-list">';
			if(opts.keepDisplay || currentPage > 1){
				//上一页
				html += '<a href="javascript:;" class="'+opts.prevClass+'">'+opts.prevIcon+'</a>';
			}else{
				if(opts.keepDisplay == false){
					$obj.find('.'+opts.prevClass) && $obj.find('.'+opts.prevClass).remove();
				}
			}
			if(currentPage >= opts.count + 2 && currentPage != 1 && totalPages != opts.count){
				// 首页
				var home = opts.shouldShowPage && opts.homePage ? opts.homePage : '1';
				html += opts.shouldShowPage ? '<a href="javascript:;" data-page="1">'+home+'</a><span>...</span>' : '';
			}
			// 结束所在页码
			var end = currentPage + opts.count;
			// 开始所在页码
			var start = '';
			// 忽略start为负数
			// 根据当前页码动态显示分页结构
			start = currentPage === totalPages ? currentPage - opts.count - 2 : currentPage - opts.count;
			((start > 1 && currentPage < opts.count) || currentPage == 1) && end++;
			(currentPage > totalPages - opts.count && currentPage >= totalPages) && start++;
			for (;start <= end; start++) {
				if(start <= totalPages && start >= 1){
					if(start != currentPage){
						html += '<a href="javascript:;" data-page="'+start+'">'+ start +'</a>';
					}else{
						html += '<span class="'+opts.activeClass+'">'+start+'</span>';
					}
				}
			}
			if(currentPage + opts.count < totalPages && currentPage >= 1 && totalPages > opts.count){
				// 尾页
				var end = opts.shouldShowPage && opts.endPage ? opts.endPage : totalPages;
				html += opts.shouldShowPage ? '<span>...</span><a href="javascript:;" data-page="'+totalPages+'">'+end+'</a>' : '';
			}
			if(opts.keepDisplay || currentPage < totalPages){
				// 下一页
				html += '<a href="javascript:;" class="'+opts.nextClass+'">'+opts.nextIcon+'</a>'
			}else{
				if(opts.keepDisplay == false){
					$obj.find('.'+opts.nextClass) && $obj.find('.'+opts.nextClass).remove();
				}
			}
			html += opts.jump ? '<input type="text" class="'+opts.jumpInpClass+'"><a href="javascript:;" class="'+opts.jumpBtnClass+'">'+opts.jumpBtn+'</a>' : '';
			html += '</div>';
			$obj.empty().html(html);
		};

		// 绑定事件
		this._listenEvent = function(){
			var that = this;
			var totalPages = that._getTotalPages();//总页数
			var index = 1;
			$obj.off().on('click','a',function(){
				if($(this).hasClass(opts.nextClass)){
					if($obj.find('.'+opts.activeClass).text() >= totalPages){
						$(this).addClass('disabled');
						return false;
					}else{
						index = parseInt($obj.find('.'+opts.activeClass).text()) + 1;
					}
				}else if($(this).hasClass(opts.prevClass)){
					if($obj.find('.'+opts.activeClass).text() <= 1){
						$(this).addClass('disabled');
						return false;
					}else{
						index = parseInt($obj.find('.'+opts.activeClass).text()) - 1;
					}
				}else if($(this).hasClass(opts.jumpBtnClass)){
					if($obj.find('.'+opts.jumpInpClass).val() !== ''){
						index = parseInt($obj.find('.'+opts.jumpInpClass).val());
					}else{
						return;
					}
				}else{
					index = parseInt($(this).data('page'));
				}
				that._renderPages(index);
				typeof opts.callback === 'function' && opts.callback(that);
			});
			// 输入跳转的页码
			$obj.on('input propertychange','.'+opts.jumpInpClass,function(){
				var $this = $(this);
				var val = $this.val();
				var reg = /[^\d]/g;
	            if (reg.test(val)) {
	                $this.val(val.replace(reg, ''));
	            }
	            (parseInt(val) > totalPages) && $this.val(totalPages);
	            if(parseInt(val) === 0){//最小值为1
	            	$this.val(1);
	            }
			});
			// 回车跳转指定页码
			$document.keydown(function(e){
		        if(e.keyCode == 13 && $obj.find('.'+opts.jumpInpClass).val()){
		        	var index = parseInt($obj.find('.'+opts.jumpInpClass).val());
		            that._renderPages(index);
					typeof opts.callback === 'function' && opts.callback(that);
		        }
		    });
		};

		// 初始化
		this._init = function(){
			this._renderPages(opts.currentPage);
			this._listenEvent();
			if(opts.hidePages && this._getTotalPages() == '1' || this._getTotalPages() == '0') $obj.hide();
		};
		this._init();
	};

	$.fn.pagination = function(parameter,callback){
		if(typeof parameter == 'function'){// 重载
			callback = parameter;
			parameter = {};
		}else{
			parameter = parameter || {};
			callback = callback || function(){};
		}
		var options = $.extend({},defaults,parameter);
		return this.each(function(){
			// 实例
			var pagination = new Pagination(this, options);
			// 回调
			callback(pagination);
		});
	};

}));
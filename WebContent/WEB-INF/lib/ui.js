/**
 *
 */

$(document).ready(function(){
/*------------------ Menu bar ------------------*/
	var isMoveBar = false;
	$('.bar').on('mousedown', function(e){
		isMoveBar = true;
	});

	$(document).on('mousemove', function(e){
		if(isMoveBar){
			$('.menu').css('width', e.pageX);
		}
	});

	$(document).on('mouseup', function(e){
		if(isMoveBar){
			$('.menu').css('width', e.pageX);
			isMoveBar = false;
		}
	});

/*------------------ Item information ------------------*/
	$('.content-body > .item').on('click', function(e){
		selectItem(e);
	});

	$('.content-body').on('click', function(e){
		if(e.currentTarget == e.target){
			$('.select').fadeOut();
			$('.info').fadeOut();
		}
	});

	$('.close-info').on('click', function(){
		$('.select').fadeOut();
		$('.info').fadeOut();
	});

/*------------------ Item method ------------------*/
	$('#register_item').on('click', function(){
		$('#pop_register_item').show();
		$('#pop_modify_item').hide();
		$('#pop_register').fadeIn();
		$('.pop-header-title').text('Register');
	});

	$('#modify_item').on('click', function(){
		$('#pop_modify_item').show();
		$('#pop_register_item').hide();
		$('#pop_register').fadeIn();
		$('.pop-header-title').text('Modify');

		var selector = $('.select').filter(function(){
			return $(this).css('display') != 'none';
		});
		setItemModifyPopup($(selector).parent().data());

	});

	$('#delete_item').on('click', function(){
		var selector = $('.select').filter(function(){
			return $(this).css('display') != 'none';
		});
		$('.info').fadeOut();
		callDeleteItem($(selector).parent().data()._id);
		$(selector).parent().remove();
	});

/*------------------ Item load ------------------*/
	callGetItems();

/*------------------ Popup ------------------*/
	$('.close-pop').on('click', function(e){
		$(e.currentTarget).parents('.pop-default').fadeOut();
	});

	$('#pop_register_item').on('click', function(e){
		var properties = $('.pop-register-property');
		var data = {};

		$.each(properties, function(index, element){
			var name = null;
			var value = null;
			var property = $(element).find('input').attr('name');
			if (typeof property != 'string') {
				name = $(element).children().eq(0).find('input').val();
				value = $(element).children().eq(1).find('input').val();
				if (name != '') {
					data[name] = value;
				}
			} else {
				name = $(element).children().eq(0).text();
				if(property == 'img'){
					value = $(element).find('img').attr('src');
				} else {
					value = $(element).find('input').val();
				}
				data[property] = value;
			}
		});

		callInsertItem(data, e);
	});

	$('#pop_modify_item').on('click', function(e){
		var properties = $('.pop-register-property');
		var data = {};

		$.each(properties, function(index, element){
			var name = null;
			var value = null;
			var property = $(element).find('input').attr('name');
			if (typeof property != 'string') {
				name = $(element).children().eq(0).find('input').val();
				value = $(element).children().eq(1).find('input').val();
				if (name != '') {
					data[name] = value;
				}
			} else {
				name = $(element).children().eq(0).text();
				if(property == 'img'){
					value = $(element).find('img').attr('src');
				} else {
					value = $(element).find('input').val();
				}
				data[property] = value;
			}
		});

		callUpdateItem(data, e);
	});

	$('.pop-register-property input[type="file"]').on('change', function(e){
		var img = $(this).parent().find('img');
        var files = e.target.files;

	    // FileReader support
	    if (FileReader && files && files.length) {
	        var fr = new FileReader();
	        fr.onload = function () {
	        	img.attr('src', fr.result);
	        }
	        fr.readAsDataURL(files[0]);
	    }
	});

	$('#pop_register_add_column').on('click', function(e){
		var column = document.createElement('div');
		column.className = 'pop-register-property';
		column.innerHTML = '<div><input type="text"></div>'
			+ '<div><input type="text"></div>'
			+ '<div class="pop_register" onclick="$(event.currentTarget).parent().remove();">X</div>';
		$('.pop-register-dynamic-properties').append(column).append(' ');
	});

});

/**
 * Item 선택
 * @param e
 */
function selectItem(e){
	$('.select').fadeOut();
	$(e.currentTarget).find('.select').fadeIn("fast");
	setItemInfo($(e.currentTarget).data());
	$('.info').fadeIn();
}

/**
 * 수정 팝업 Item data 세팅
 * @param data
 */
function setItemModifyPopup(data){
	$('.pop-register-dynamic-properties').empty();
	$('.info-item-property img').attr('src', null);
	Object.keys(data).map(function(key, index){
		if (key == 'img') {
			$('.pop-register-property img').attr('src', data[key]);
		} else if (key == '_id' || key == 'title' || key == 'type' || key == 'status' || key == 'date' || key == 'position') {
			$('.pop-register-property input[name="' + key + '"').val(data[key]);

		} else {
			var column = document.createElement('div');
			column.className = 'pop-register-property';
			column.innerHTML = '<div><input type="text" value="' + key + '"></div>'
				+ '<div><input type="text" value="' + data[key] + '"></div>'
				+ '<div class="pop_register" onclick="$(event.currentTarget).parent().remove();">X</div>';
			$('.pop-register-dynamic-properties').append(column).append(' ');
		}
	});
}

/**
 * Item information data 세팅
 * @param data
 */
function setItemInfo(data){
	$('#dynamic_info').empty();
	$('.info-item-property img').attr('src', null);
	Object.keys(data).map(function(key, index){
		if(key == 'img'){
			$('.info-item-property img').attr('src', data[key]);

		} else if(key == '_id' || key == 'title' || key == 'type' || key == 'status' || key == 'date' || key == 'position') {
			$('.info-item-property div[name="' + key + '"]').text(data[key]);

		} else {
			var info = document.createElement('div');
			info.className = 'info-item-property';
			info.innerHTML = '<div>' + key + '</div>'
				+ '<div name=' + data[key] + '>' + data[key] + '</div>';
			$('#dynamic_info').append(info).append(' ');
		}
	});
}

/**
 * Item 추가
 * @param data
 * @param isFront
 */
function registerItem(data, isFront){
	var item = document.createElement('div');
	item.className = 'item';
	item.innerHTML = '<div class="item-content">'
		+ '<div name="img">'
		+ '<div>'
		+ '<img src="' + data.img + '">'
		+ '</div>'
		+ '</div>'
		+ '<div name="type">' + data.type + '</div>'
		+ '<div name="status">' + data.status + '</div>'
		+ '<div name="date">' + data.date + '</div>'
		+ '<div name="position">' + data.position + '</div>'
		+ '</div>'
		+ '<hr>'
		+ '<div class="item-title">' + data.title + '</div>'
		+ '<div class="select"></div>';
	$(item).on('click', function(e){
		selectItem(e);
	});

	$(item).data(data);

	if(isFront) {
		$('.content-body').prepend(item).prepend(' ');

	} else {
		$('.content-body').append(item).append(' ');
	}

}

/**
 * Item 수정
 * @param data
 * @param isFront
 */
function modifyItem(data){
	var selector = $('.select').filter(function(){
		return $(this).css('display') != 'none';
	});
	var item = $(selector).parent();

	Object.keys(data).map(function(key, index){
		if(key == 'img'){
			$(item).find('div[name="img"] img').attr('src', data[key]);

		} else {
			$(item).find('div[name="' + key + '"]').text(data[key]);
		}
	});

	$(item).data(data);

}

/*------------------ call Api ------------------*/
/**
 * Item 삭제 Api
 * @param id
 */
function callDeleteItem(id){
	$.ajax({
		url: 'http://192.168.10.96:8089/datascrip/mongo/deleteMongo'
		,data: {
			_id : id
		}
		,type: 'get'
		,success: function(jsonData) {
			console.log(jsonData);
		}
	});
}

/**
 * Item 수정 Api
 * @param data
 * @param e
 */
function callUpdateItem(data, e){
	$.ajax({
		url: 'http://192.168.10.96:8089/datascrip/mongo/updateMongo'
		,data: data
		,type: 'post'
		,success: function(jsonData) {
			console.log(jsonData);
			modifyItem(data);
			$(e.currentTarget).parents('.pop-default').fadeOut();
		}
	});
}

/**
 * Item 등록 Api
 * @param data
 * @param e
 */
function callInsertItem(data, e){
	$.ajax({
		url: 'http://192.168.10.96:8089/datascrip/mongo/insertMongo'
		,data: data
		,type: 'post'
		,success: function(jsonData) {
			console.log(jsonData);
			if (jsonData.result) {
				data['_id'] = jsonData._id;
			}

			$(e.currentTarget).parents('.pop-default').fadeOut();
			registerItem(data, true);
		}
	});

}

/**
 * Item 조회 Api
 */
function callGetItems(){
	$.ajax({
		url: 'http://192.168.10.96:8089/datascrip/mongo/getMongoList'
		,type: 'get'
		,dataType: 'json'
		,success: function(jsonData){
			console.log(jsonData);
	    	$.each(jsonData.rows, function(index, element){
		    	registerItem(element, false);
	    	});

		}
	});
}

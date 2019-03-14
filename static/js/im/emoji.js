var WebImEmoji = {
	getEmoji: function() {
		var emoji = {
			path: 'static/image/faces/' /*表情包路径*/ ,
			map: {
				'[):]': 'ee_1.png',
				'[:D]': 'ee_2.png',
				'[;)]': 'ee_3.png',
				'[:-o]': 'ee_4.png',
				'[:p]': 'ee_5.png',
				'[(H)]': 'ee_6.png',
				'[:@]': 'ee_7.png',
				'[:s]': 'ee_8.png',
				'[:$]': 'ee_9.png',
				'[:(]': 'ee_10.png',
				'[:\'(]': 'ee_11.png',
				'[:|]': 'ee_18.png',
				'[(a)]': 'ee_13.png',
				'[8o|]': 'ee_14.png',
				'[8-|]': 'ee_15.png',
				'[+o(]': 'ee_16.png',
				'[<o)]': 'ee_12.png',
				'[|-)]': 'ee_17.png',
				'[*-)]': 'ee_19.png',
				'[:-#]': 'ee_20.png',
				'[:-*]': 'ee_22.png',
				'[^o)]': 'ee_21.png',
				'[8-)]': 'ee_23.png',
				'[(|)]': 'ee_24.png',
				'[(u)]': 'ee_25.png',
				'[(S)]': 'ee_26.png',
				'[(*)]': 'ee_27.png',
				'[(#)]': 'ee_28.png',
				'[(R)]': 'ee_29.png',
				'[({)]': 'ee_30.png',
				'[(})]': 'ee_31.png',
				'[(k)]': 'ee_32.png',
				'[(F)]': 'ee_33.png',
				'[(W)]': 'ee_34.png',
				'[(D)]': 'ee_35.png'
			}
		};
		return emoji;
	},
	parseEmoji: function(msg) {

		var emoji = this.getEmoji(),
			reg = null;
		for(var face in emoji.map) {
			if(emoji.map.hasOwnProperty(face)) {
				while(msg.indexOf(face) > -1) {
					msg = msg.replace(face, '<img class="emoji" src="' + emoji.path + emoji.map[face] + '" />');
				}
			}
		}
		return msg;

	},
	encode: function encode(str) {
		if(!str || str.length === 0) {
			return '';
		}
		var s = '';
		s = str.replace(/&amp;/g, "&");
		s = s.replace(/<(?=[^o][^)])/g, "&lt;");
		s = s.replace(/>/g, "&gt;");
		s = s.replace(/\"/g, "&quot;");
		s = s.replace(/\n/g, "<br>");
		return s;
	},
}
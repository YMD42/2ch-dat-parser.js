/* ==========================================================
 * 2ch-dat-parser.js
 * ==========================================================
 * Copyright 2013 YMD42 https://github.com/YMD42
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

var TwoChDatParser = function(arg) {
    var self = this;
    self.data = null;

    self.encode = function(data) {
n	var data_array = [];
	for (var i = 0; i < data.length; i++) {
	    data_array[i] = data.charCodeAt(i) & 0xff;
	}
	var utf8_array = Encoding.convert(data_array, 'UNICODE', 'SJIS');

	return Encoding.codeToString(utf8_array);
    };

    self.JSON_data = function() {
	console.log('parse start');

	var posts = []
	var raw_posts = self.data.split('\n');
	var thread_title = (raw_posts[0].split('<>'))[3];
	
	for (var i = 0; i < raw_posts.length; i++) {
	    var post_json = self.parse_post(raw_posts[i]);
            if (post_json == null) {
                break;
            }
            posts.push(post_json);
        }
        

        return {
            'title' : thread_title,
            'posts' : posts
        };
    };

    self.parse_post = function(post) {
        var post_array = post.split('<>');

        if (post_array.length < 4) {
            return null;
        }
        
	return {
	    name  : post_array[0],
	    email : post_array[1],
	    date  : post_array[2],
	    body  : post_array[3]
	}
    };

    self.strip_html = function(str) {
	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	return str;
    };
    
    self.init_with_data = function(data, stop_encode) {
	if (!stop_encode) {
	    data = self.encode(data);
	} 
	self.data = data  
    };
    
    self.init_with_url = function(url, stop_encode) {
	self.init_with_data(data, stop_encode);
    };
    
    // initialize
    if (arg.data) {
	self.init_with_data(arg.data, arg.stop_encode);
    } else if (arg.url) {
	self.init_with_url(arg.data, arg.stop_encode);
    }
}


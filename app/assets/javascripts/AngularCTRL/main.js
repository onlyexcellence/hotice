var MainCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout','$interval','API',
	function($scope,$routeParams,$location,ApiModel,$timeout,$interval,API){
		$scope.current_user = current_user;
		$scope.announcements = [];
		$scope.loading = false;
		$scope.user_key = {};
		$scope.main_chats = [];
		$scope.last_chat_id = null;

		$scope.x = {};
		$scope.n = false;
		$scope.title = '';
		$scope.showSignup = false;

		$scope.$on('$routeChangeSuccess',function (event,current,previous,rejection){


			
		});

		zE(function(){
			var zduser = {
				name: current_user['gamertag'],
				email: current_user['email'],
				external_id: current_user['objectId']
			};
			zE.identify(zduser);
		});

		$scope.messages = API.messages;
		$scope.composer = $scope.messages.new({user: $scope.current_user});

		$scope.refreshUser = function(){

			this.options = {
				type: 'users',
				sub: 'me'
			};

			ApiModel.query(this.options,function(data){

				current_user = data.user;
				$scope.current_user = current_user;

			});

		};

		$scope.getUsers = function(complete){

			this.options = {
				type: 'users'
			};

			ApiModel.query(this.options,function(data){

				$scope.users = angular.copy(data.body.results);
				$scope.users.removeWhere('objectId',current_user.objectId);

				$.each(data.body.results,function(key,val){

					$scope.user_key[val.objectId] = val;

				});

				complete(data.body.results);

			});

		};
		$scope.getUsers(function(users){
			
			$scope.users = users;

		});

		$scope.getOnlineUsers = function(){

			this.options = {
				type: 'online'
			};

			ApiModel.query(this.options,function(data){
				
				$scope.onlineUsers = data.results

			});

		};
		$scope.getOnlineUsers();

		// setInterval(function(){

		// 	$scope.getNotifications(function(notifications){
		// 		$scope.notifications = notifications;
		// 	});
		// 	$scope.getOnlineUsers();

		// },20000);

		$scope.linkTo = function(loc){

			window.location = loc;

		};

		$scope.displayDate = displayDate;

		$scope.getMainMessages = function(){

			this.options = {
				type: 'messages',
				sub: 'main',
				extend: 'all'
			};

			ApiModel.query(this.options,function(data){

				$scope.main_chats = data.messages;

				if (data.messages.length > 0 && data.messages[0].createdAt != $scope.last_chat_id){
					$timeout(function(){
						var objDiv = document.getElementById('chats');
						objDiv.scrollTop = objDiv.scrollHeight;
					},10);
				};

				if (data.messages.length > 0){
					$scope.last_chat_id = data.messages[0].createdAt;
				}

			},function(data){

				JP({e: data});

			});

		};

		$scope.sendMainChat = function(entry){

			$scope.main_chat = null;
			$scope.main_holder = 'Saving...'

			var body = angular.copy(entry);

			this.options = {
				type: 'messages'
			};

			var m = {
				message: {
					location: 'main',
					userId: $scope.current_user.objectId,
					body: body
				}
			};

			var Message = new ApiModel(m);

			Message.$create(this.options,function(data){

				$scope.main_chats.push(data.message);
				$scope.main_chat = null;
				$scope.main_holder = 'Enter message...'
				$timeout(function(){
					var objDiv = document.getElementById('chats');
					objDiv.scrollTop = objDiv.scrollHeight;
				},10);

			},function(){

				$scope.main_chat = body;
				$scope.main_holder = 'Enter message...'

			});

		};

		$scope.channel = {
			messages: [],
			info: [],
			count: 0
		};

		$scope.getChannel = function(){

			this.options = {
				type: 'channel'
			};

			ApiModel.query(this.options,function(data){

				var tmp = [];
				angular.forEach(data.messages,function(val,key){

					tmp.push(val);

				});

				$scope.channel.messages = tmp;

				tmp = [];
				var count = 0;
				angular.forEach(data.info,function(val,key){

					tmp.push(val);
					if (!val.seen){count++;}

				});

				$scope.channel.info = tmp;
				$scope.channel.count = count;
				if (count > 0){
					$scope.title = ' ('+$scope.channel.count+')';
				} else {
					$scope.title = '';
				}

			});

		};
		$scope.getChannel();
		$interval(function(){
			$scope.getChannel();
		},1000);

		$scope.setSeen = function(){

			if (!$scope.n || $scope.channel.count == 0){return false;}

			$scope.channel.count = 0;

			this.options = {
				type: 'channel',
				sub: 'seen'
			};

			ApiModel.query(this.options,function(data){



			},function(data){



			});

		};

		$scope.dismissNotification = function(notification){

			$scope.x[notification.id] = true;

			this.options = {
				type: 'channel',
				id: notification.id,
				info: true
			};

			ApiModel.destroy(this.options,function(data){

				delete $scope.x[notification.id];

				$scope.channel.info.removeWhere('id',notification.id);

			},function(data){

				delete $scope.x[notification.id];

			});

		};

		$scope.acceptInvite = function(notification){

			$scope.x[notification.id] = true;

			this.options = {
				type: 'relations',
				id: notification.id,
				notification: 'delete'
			};

			var Relation = new ApiModel({relation: {status: 'accepted'}});

			Relation.$save(this.options,function(data){

				delete $scope.x[notification.id];

				window.location = '#/teams/'+notification.team.objectId;

			},function(){

				delete $scope.x[notification.id];

			});

		};

		$scope.seasonSignup = function(){

			$scope.x.seasonSignup = true;

			this.options = {
				type: 'relations'
			};

			var Relation = new ApiModel({
				relation: {
					user: {
						__type: 'Pointer',
						className: '_User',
						objectId: current_user.objectId
					},
					type: 'season',
					status: 'signup',
					event: {
						__type: 'Pointer',
						className: 'Events',
						objectId: 'x9XK1Bb02p'
					}
				}
			});

			Relation.$create(this.options,function(data){

				delete $scope.x.seasonSignup;
				$scope.showSignup = false;

			},function(data){

				JP({e: data});

				delete $scope.x.seasonSignup;
				$scope.showSignup = false;

			});

		};

	}
];
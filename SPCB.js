(function(author,version){
	var debug = function(obj){
		if(console) console.debug(obj);	
	};

	var SPCB = function(url){
		return new spCB(url);
	};
	
	var spCB = function(url){
		this.ctx = url ? new SP.ClientContext(url) : SP.ClientContext.get_current();		
		return this;
	};
	
	spCB.prototype = {
		getLists: function(cb){
			var web = this.ctx.get_web();
			var lists = web.get_lists();
			var retVal = [];
			this.ctx.load(lists);
			this.ctx.executeQueryAsync(Function.createDelegate(this,function(sender,args){
				var listsEnum = lists.getEnumerator();
				
				while(listsEnum.moveNext()) {
					retVal.push(new spCBList(listsEnum.get_current()));
				}
				
				cb(null,retVal);
			}),Function.createDelegate(this,function(sender,args){
				cb(args);
			}));
		},
		getList: function(list,cb){ return new spCBList(list,cb) },
		author: author,
		version: version
	}
	
	var spCBList = function(list,cb){
		this.List = list;
	};
	
	ExecuteOrDelayUntilScriptLoaded(function(){	
		if(!window.SPCB || window.SPCB.Version < SPCB.Version){
			window.SPCB = SPCB;
			debug('spcb initialized');
		}
	},"sp.js");
})("Max Nowack",0.1);


ExecuteOrDelayUntilScriptLoaded(function(){
		var ctx = SPCB();
		ctx.getLists(function(err,lists){
			var list = lists[0];
		});
},"sp.js")

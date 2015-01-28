  
    // add the new timeline by timeline.add(id_of_timeline , DOM element can be null, {framse} , options )
    timeline.add("slide1",document.querySelector('.hello'),
							{
								// new frame should begin with f_ and the duration to exicut the frame exemple f_100 
								f_100 : function(){
								 // this frame will exicuted time = 100 
									this.$el.innerHTML ="Hi i'm frame 100 one";
								},
								f_1 : function(){
								 // this frame will exicuted at time = 1 
									this.$el.innerHTML ="Hi i'm frame 1 one";
								}
							},
							{	
								complete : function(){ 
									// On animation is completed
								},
								tick : function(){
									// callback on each tick 
								},
								step : function(){
									// each step each translate to other frames
								},
								onrepeat : function(){
									// On each repeat of timeline 
									// i fthe loop is loop
								},
								loop : 0,
								fps : 20
							} 
						);

     timeline.play("slide1");
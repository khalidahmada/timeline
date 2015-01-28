# timeline :
Timeline is simple javascript library for making timeline easy using frames logic

#installation : 
You can use just script tag. It work also with AMD

#Exemple : 
    timeline.add("slide1",document.querySelector('.hello'),
							{
								f_100 : function(){
									this.$el.innerHTML ="Hi i'm frame 100 one";
								},
								f_1 : function(){
									this.$el.innerHTML ="Hi i'm frame 1 one";
								}
							}
						);

     timeline.play("slide1");
     
#Explain :
    // add the new timeline by timeline.add(id_of_timeline , DOM element can be null, {framse} , options )
    timeline.add("slide1",document.querySelector('.hello'),
							{
								// new frame should begin with f_ and the duration to exicut the frame exemple f_100 
								f_100 : function(){
								 // this frame will exicuted time = 100 
									this.$el.innerHTML ="Hi i'm frame 100 one";
									
									// other methods
									// this.stop();
									// to Stop animation
									// this.cast('f_1')
									// to call to the frame 'f_1'
									//this.resume()
									// to continue playing timeline
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
									// each step before moving to next frames
								},
								onrepeat : function(){
									// On each repeat of timeline 
									// if the loop is loop
								},
								loop : 0,
								fps : 20
							} 
						);

     timeline.play("slide1");
  

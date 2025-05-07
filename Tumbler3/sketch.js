let t

function setup() {
  createCanvas(600,600);
  colorMode(HSB);
  t=new TumbleSystem()
}

function draw() {
  background(240,40,100);
  t.run()
}

function mousePressed(){
  t.reset();
}

function TumbleSystem(){
  var blobs=[];
  var numBlobs=50;
  var base;
  var tumbler;
  var duration=60*15;
  var time=0;
  var Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint;

  var engine;
  var world;

  engine = Engine.create();
  world = engine.world;
  world.gravity.scale=0.001;
  Engine.run(engine);
  
  tumbler=new Tumbler(width/2,height/2,width*0.4,20,80);
  
  this.run=function(){
    for(var i=blobs.length-1; i>=0; i--){
      blobs[i].show();
      if(!blobs[i].run()){
        blobs[i].destroy();
        blobs.splice(i,1);
      }
    }
    if(blobs.length<numBlobs && time<duration){
      blobs.push(new Blob(random(width*0.1)+width*0.45,height*0.2,floor(random(5,30)),240));
    }
    tumbler.show();
    tumbler.run();
    time++;
  }
  
  this.reset=function(){
    blobs.forEach(function(blob){
      blob.destroy();
    });
    blobs=[];
    time=0;
  }
  
  function Tumbler(x,y,r,t,n){
    var a=0;
    t*=2;
    var rotRange=PI/50;
    var rot=0;
    var aStep=TWO_PI/n;
    var walls=[];
    var bodies=[];
    var stirrers=[];
    var numStirrers=7;
    var stirrerLen=r/4;
    var stirrerRad=r-stirrerLen/2;
    console.log(stirrerRad);
    var stirrerStep=TWO_PI/numStirrers;

    var options = {
      friction: 0.1,
      frictionAir: 0,
      restitution: 0.8,
      isStatic: true
    }
    for(var i=0; i<n; i++){
      var vertices=[];
      var px=cos((i)*aStep)*(r);
      var py=sin((i)*aStep)*(r);
      vertices.push({x:cos((i-0.5)*aStep)*r-px, y:sin((i-0.5)*aStep)*r-py});
      vertices.push({x:cos((i+0.5)*aStep)*r-px, y:sin((i+0.5)*aStep)*r-py});
      vertices.push({x:cos((i+0.5)*aStep)*(r+t)-px, y:sin((i+0.5)*aStep)*(r+t)-py});
      vertices.push({x:cos((i-0.5)*aStep)*(r+t)-px, y:sin((i-0.5)*aStep)*(r+t)-py});
      var body=Bodies.fromVertices(x+px, y+py, vertices, options);
      World.add(world, body);
      walls.push({
        verts: vertices,
        body: body,
        a: i*aStep
      });
    }
    for(var i=0; i<numStirrers; i++){
      var body=Bodies.rectangle(0,0,t,stirrerLen,options);
      World.add(world, body);
      var px=cos(i*stirrerStep+PI/2)*stirrerRad;
      var py=sin(i*stirrerStep+PI/2)*stirrerRad;
      Matter.Body.setPosition(body, {x:x+px, y:y+py});
      Matter.Body.rotate(body, i*stirrerStep);
      stirrers.push({
        body:body
      });
    }

    this.run=function(){
      walls.forEach(function(wall){
        var px=cos(a+wall.a)*(r);
        var py=sin(a+wall.a)*(r);
        Matter.Body.setPosition(wall.body, {x:x+px, y:y+py});
        Matter.Body.rotate(wall.body, rot);
      });
      stirrers.forEach(function(stirrer,i){
        var px=cos(a+i*stirrerStep+PI/2)*stirrerRad;
        var py=sin(a+i*stirrerStep+PI/2)*stirrerRad;
        Matter.Body.setPosition(stirrer.body, {x:x+px, y:y+py});
        Matter.Body.rotate(stirrer.body, rot);
      });
      a+=rot;
      rot=constrain(sin(frameCount*PI/200)*rotRange*3,-rotRange, rotRange);
    };

    this.show=function(){
      walls.forEach(function(wall){
        var pos = wall.body.position;
        var angle = wall.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        stroke(0,0,100);
        noStroke();
        fill(0,0,100,0.4);
        beginShape();
        wall.verts.forEach(function(vert){
          vertex(vert.x,vert.y);
        });
        endShape(CLOSE);
        pop();
        // push();
        // translate(x,y);
        // stroke(0,0,100);
        // fill(0,0,100,0.5);
        // beginShape();
        // wall.verts.forEach(function(vert){
        //   vertex(vert.x,vert.y);
        // });
        // endShape(CLOSE);
        // pop();
      });

      stirrers.forEach(function(stirrer){
        var pos = stirrer.body.position;
        var angle = stirrer.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        fill(0,0,100,0.4);
        stroke(0,0,100);
        noStroke();
        rectMode(CENTER);
        rect(0,0,t,stirrerLen);
        pop();
      });
    };
  }



  function Blob(x,y,r,rLim){
    var ttlMax=floor(random(400,600));
    var ttl=ttlMax;
    var trail=[];
    var trailMax=15;//random(10,70);
    this.pos=createVector(x,y);
    this.r=r;
    var col=random(10,40);
    var sat=random(40,60);
    // if(random(10)<5){
      col=random(0,30);
    // }
    var options = {
      friction: 0.1,
      frictionAir: 0,
      restitution: 0.1,
      isStatic: false
    };
    this.body = Bodies.circle(x,y, this.r, options);
    World.add(world, this.body);

    this.run=function(){
      ttl--;
      this.pos = this.body.position;
      trail.push({x: this.pos.x, y: this.pos.y});
      var d=dist(width/2, height/2,this.pos.x, this.pos.y);
      return d<rLim &&ttl>0 && this.pos.x>0 && this.pos.x<width && this.pos.y>0 && this.pos.y<height;
    };

    this.destroy=function(){
      World.remove(world, this.body);
      this.body=null;
    };

    this.show=function(){
      // this.pos = this.body.position;
      // trail.push({x: this.pos.x, y: this.pos.y});
      // console.log(trail);
      if(trail.length>trailMax){
        trail.shift();
      }
      var angle = this.body.angle;
      push();
      translate(this.pos.x, this.pos.y);
      rotate(angle);
      // stroke(255);
      noStroke();
      // fill(col,sat,80);
      stroke(col,sat+20,100,1);
      strokeWeight(4)
      fill(col,sat,100,1)
      ellipse(0,0,r*2);
      pop();


  //     beginShape();
  //     stroke(col,trail.length>0?(1-trail[0].y/height)*100:0,trail.length>0?(1-trail[0].y/height)*100:0,0.7);
  //     strokeWeight(4*ttl/ttlMax);//+5*(1-ttl/ttlMax));
  //     noFill();
  //     trail.forEach(function(tp){
  //       vertex(tp.x, tp.y);
  //       // ellipse(tp.x,tp.y,5);
  //     });

  //     endShape();
    };
  }

}






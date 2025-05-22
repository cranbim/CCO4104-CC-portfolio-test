var blobs=[];
var numBlobs=35;
var nextBlob=0;
var inCols=[
  [128,180,80],
  [220,40,0],
  [20,145,190],
  [132,220,220],
  [222,35,160],
  [170,143,32]
  ];
var outCols=[
  [160,40,40],
  [30,90,90],
  [20,65,170],
  [80,20,0],
  [80,100,20],
  [43,43,172]
  ];
var bgColMin=[185,0,125]
var bgColMax=[65,0,225]
var bgColNow=[125,0,185]

function setup() {
  createCanvas(600,600);
}

function draw() {
  for(let i=0; i<3; i++){
    bgColNow[i]=bgColMin[i]+sin(frameCount/50)*(bgColMax[i]-bgColMin[i])/2
  }
  background(125,0,185);
  background(bgColNow[0], bgColNow[1], bgColNow[2]);
  if(blobs.length<numBlobs && random(10)<3){
    blobs.push(new PulseBlob(nextBlob++, random(width), random(height), random(height*0.005,height*0.035), random(inCols), random(outCols)));
  }
  for(var i=blobs.length-1; i>=0; i--){
    blobs[i].show();
    blobs[i].collide(blobs);
    if(!blobs[i].run()){
      blobs.splice(i,1);
    }
  }
}

function PulseBlob(id,x,y,r, inCol, outCol){
  this.id=id;
  this.rNow=r*1.5;
  var speed=1;
  this.speed=1;
  var ttbMax=50;
  var ttb=ttbMax;
  var ttlMax=200;
  var ttl=ttlMax;
  var ttdMax=100;
  var ttd=ttdMax;
  var rNow=0;
  var rInner=0;
  var pulse=1;
  var rA=0;
  var rARot=PI/50;
  var a=0;
  var aRot=PI/20;
  var pos=createVector(x,y);
  this.pos=pos;
  var rMult=0;
  var drift=p5.Vector.random2D().setMag(random(1,3));
  
  this.show=function(){
    // console.log(pos.x, pos.y,r);
    push();
    translate(pos.x, pos.y);
    rotate(a);
    stroke(20);
    strokeWeight(r/3);
    // fill(outCol[0], outCol[1], outCol[2]);
    fill(255)
    ellipse(0,0,rNow*2);
    // fill(inCol[0],inCol[1],inCol[2]);
    fill(bgColNow[0], bgColNow[1], bgColNow[2])
    strokeWeight(r/5);
    ellipse(0,r*0.3*rMult,rInner*2*rMult);
    pop();
  };
  
  this.collide=function(others){
    others.forEach(function(other){
      if(other.id!==id){
        if(pos.dist(other.pos)<rNow+other.rNow){
          
          var acc=p5.Vector.sub(pos,other.pos).setMag((speed+other.speed)/2);
          drift.add(acc);
          // var away=p5.Vector.sub(pos,other.pos);
          // var awayD=away.mag();
          // var awayA=away.heading();
          // pos.add(away.setMag((rNow+other.rNow-awayD)));
          // var incidenceA=awayA-drift.heading();
          // drift.rotate(-drift.heading()+awayA+incidenceA);
        }
      }
    });
    
  };
  
  this.run=function(){
    a+=aRot;
    rA+=rARot;
    drift.limit(4);
    speed=drift.mag();
    this.speed=speed;
    pos.add(drift);
    edges();
    pulse=sin(rA)*0.4+0.6;
    rInner=pulse*r*2;
    if(ttb>0){
      ttb--;
      rMult=1-ttb/ttbMax;
    } else if(ttl>0){
      rMult=1;
      ttl--;
    } else {
      ttd--;
      rMult=ttd/ttdMax;
    }
    rNow=r*2.5*rMult;
    this.rNow=rNow;
    return ttd>0;
  };
  
  function edges(){
    if(pos.x-r*2>width){
      pos.x=-r*2;
    }
    if(pos.x+r*2<0){
      pos.x=width+r*2;
    }
    if(pos.y-r*2>height){
      pos.y=-r*2;
    }
    if(pos.y+r*2<0){
      pos.y=height+r*2;
    }
  }
}